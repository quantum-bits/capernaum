import { Logger } from "@nestjs/common";
import { Process, Processor } from "@nestjs/bull";
import { REPORTER_QUEUE_NAME } from "@apps/common.constants";
import { Job } from "bull";
import { QualtricsSurveyResponse } from "@qapi/qualtrics-api/qualtrics-api.types";
import { quillDeltaToHtml, quillHtmlToText } from "@server/src/helpers/quill";
import { EventCreateInput } from "@server/src/events/entities";
import { EventService } from "@server/src/events/event.service";
import { QualtricsApiService } from "@qapi/qualtrics-api/qualtrics-api.service";
import { SurveyService } from "@server/src/survey/survey.service";
import { WriterService } from "@server/src/writer/writer.service";
import { MailService } from "@server/src/mail/mail.service";

import debug from "debug";
import { PROM_METRIC_EMAILS_SENT } from "@apps/reporter/src/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Counter } from "prom-client";
const qualtricsDebug = debug("qualtrics");

@Processor(REPORTER_QUEUE_NAME)
export class ReportQueueConsumer {
  private readonly logger = new Logger(ReportQueueConsumer.name);

  constructor(
    private readonly eventService: EventService,
    private readonly qualtricsApiService: QualtricsApiService,
    private readonly surveyService: SurveyService,
    private readonly writerService: WriterService,
    private readonly mailService: MailService,
    @InjectMetric(PROM_METRIC_EMAILS_SENT)
    private emails_sent_counter: Counter<string>
  ) {}

  @Process()
  async processReport(job: Job) {
    const qualtricsSurveyId = job.data.qualtricsSurveyId;
    const qualtricsResponseId = job.data.qualtricsResponseId;

    this.logger.debug(
      `Processing response ${qualtricsResponseId} to survey ${qualtricsSurveyId}`
    );

    // Find the survey
    const survey = await this.surveyService.findSurveyByQualtricsId(
      qualtricsSurveyId
    );
    qualtricsDebug("survey - %O", survey);

    // Grab the response from Qualtrics
    const qualtricsResponse = await this.qualtricsApiService.getOneResponse(
      qualtricsSurveyId,
      qualtricsResponseId
    );
    qualtricsDebug("qualtricsResponse - %O", qualtricsResponse);

    // Store it locally.
    const importedResponse = await this.surveyService.importQualtricsSurveyResponse(
      survey.id,
      qualtricsResponse as QualtricsSurveyResponse
    );
    this.logger.debug("Imported response");
    qualtricsDebug("importedResponse - %O", importedResponse);

    // Fetch the letter.
    // TODO: Sort out how to pass stuff to `renderLetter`.
    const letter = await this.surveyService.findLetter(survey.id);

    // Write a letter.
    const writerOutput = await this.writerService.renderLetter(
      letter.id,
      importedResponse.surveyResponse.id
    );
    this.logger.debug("Rendered letter");
    qualtricsDebug("writerOutput - %O", writerOutput);

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
    this.logger.debug("Sent email");
    this.emails_sent_counter.inc();
    qualtricsDebug("mailInfo - %O", mailInfo);

    // Create event.
    const createInput: EventCreateInput = {
      type: "Completed",
      details: `Survey '${qualtricsSurveyId}' completed; response '${qualtricsResponseId}'`,
    };
    return this.eventService.createEvent(createInput);
  }
}
