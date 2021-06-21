import { PROM_METRIC_EMAILS_SENT } from "@common/common.constants";
import { QualtricsSurveyResponse } from "@qapi/qualtrics-api.types";
import { quillDeltaToHtml, quillHtmlToText } from "@helpers/quill";
import { EventService } from "@server/src/events/event.service";
import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import { QualtricsService } from "@server/src/qualtrics/qualtrics.service";
import { SurveyService } from "@server/src/survey/services/survey.service";
import { WriterService } from "@server/src/writer/writer.service";
import { MailService } from "@server/src/mail/mail.service";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Counter } from "prom-client";
import { getDebugger } from "@helpers/debug-factory";
import { LetterService } from "@server/src/letter/letter.service";
import { SurveyRespondentType } from "@server/src/survey/survey.types";
import { Injectable, Logger } from "@nestjs/common";
import { MultiTimer } from "@helpers/multi-timer";
import { GroupService } from "@server/src/group/group.service";

const debug = getDebugger("reporter");

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly qualtricsApiService: QualtricsApiService,
    private readonly qualtricsService: QualtricsService,
    private readonly writerService: WriterService,
    private readonly mailService: MailService,
    private readonly eventService: EventService,
    private readonly letterService: LetterService,
    private readonly surveyService: SurveyService,
    private readonly groupService: GroupService,
    @InjectMetric(PROM_METRIC_EMAILS_SENT)
    private emails_sent_counter: Counter<string>
  ) {}

  private logMaybeDebug(message: string) {
    this.logger.log(message);
    debug(message);
  }

  async processIndividualReport(
    qualtricsSurveyId: string,
    qualtricsResponseId: string
  ) {
    this.logMaybeDebug(
      `Processing response ${qualtricsResponseId} (survey ${qualtricsSurveyId})`
    );

    const mt = new MultiTimer();

    // Find the survey
    const survey = await this.surveyService.findByQualtricsId(
      qualtricsSurveyId
    );
    debug("survey - %O", survey);

    // Grab the response from Qualtrics
    const qualtricsResponse = await this.qualtricsApiService.getOneResponse(
      qualtricsSurveyId,
      qualtricsResponseId
    );
    debug("qualtricsResponse - %O", qualtricsResponse);

    // Store it locally.
    const importedResponse =
      await this.qualtricsService.importOneResponseForQualtricsSurvey(
        survey.id,
        qualtricsResponse as QualtricsSurveyResponse
      );
    debug("importedResponse %O", importedResponse);
    mt.record("got response from qualtrics");

    // Fetch the letter.
    const letter = await this.letterService.findForSurvey(
      survey.id,
      SurveyRespondentType.Individual
    );
    debug("letter %O", letter);

    // Write a letter.
    const writerOutput = await this.writerService.renderIndividualLetter(
      letter.id,
      importedResponse.surveyResponse.id
    );
    debug("rendered letter %O", writerOutput);
    mt.record("wrote the letter");

    // Convert Quill deltas to HTML and text.
    const htmlContent = quillDeltaToHtml(letter.emailMessage);
    const textContent = quillHtmlToText(htmlContent);

    // Send an email.
    const mailInfo = await this.mailService.sendMail({
      to: importedResponse.surveyResponse.email,
      subject: "Your Christian Life Survey Results",
      textContent,
      htmlContent,
      attachmentPath: writerOutput.pdfAbsolutePath,
    });
    this.emails_sent_counter.inc();
    debug("sent mail %O", mailInfo);

    // Create event.
    await this.eventService.createEvent({
      type: "Completed",
      details: `Survey '${qualtricsSurveyId}' completed; response '${qualtricsResponseId}'`,
    });
    debug("created event");
    debug(mt.report());

    this.logMaybeDebug(`Finished response ${qualtricsResponseId}`);
  }

  async processGroupReport(groupId: number) {
    this.logMaybeDebug(`Processing group ${groupId}`);

    // Fetch the group.
    const group = await this.groupService.readOne(groupId);
    debug("group %O", group);

    // Make sure this group has responses.
    const count = await this.groupService.countResponses(group.id);
    debug("group %d has %d responses", group.id, count);
    if (count < 1) {
      this.logger.error(
        `Group ${groupId} has ${count} responses; nothing to report`
      );
      return;
    }

    // Fetch the letter.
    const letter = await this.letterService.findForSurvey(
      group.id,
      SurveyRespondentType.Group
    );
    debug("letter %O", letter);

    // Write a letter.
    const writerOutput = await this.writerService.renderGroupLetter(
      letter.id,
      group.id
    );
    debug("rendered letter %O", writerOutput);

    // Convert Quill deltas to HTML and text.
    const htmlContent = quillDeltaToHtml(letter.emailMessage);
    const textContent = quillHtmlToText(htmlContent);

    // Send an email.
    const mailInfo = await this.mailService.sendMail({
      to: group.adminEmail,
      subject: "Your Christian Life Group Survey Results",
      textContent,
      htmlContent,
      attachmentPath: writerOutput.pdfAbsolutePath,
    });
    this.emails_sent_counter.inc();
    debug("sent mail %O", mailInfo);

    // Create event.
    await this.eventService.createEvent({
      type: "Completed",
      details: `Sent group ${group.id} report to ${group.adminEmail}`,
    });
    debug("created event");

    // Make group closed.
    await this.groupService.closeGroup(group.id);
    debug("closed group");

    this.logMaybeDebug(`Finished processing group ${group.id}`);
  }
}
