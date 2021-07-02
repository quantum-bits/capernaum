import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { LetterModel } from "../../models/letter.model";

const debug = getDebugger("fixture:letter");

export class LettersFixture extends AbstractFixture {
  delete() {
    debug("Delete letters");
    return LetterModel.query().delete();
  }

  async insert() {
    debug("Insert letters");
    return LetterModel.query().insertGraph(letters, { relate: true });
  }
}

const letters = [
  {
    id: 10,
    title: "CLS 2020 Individual",
    description: "CLS 2020 letter for individual responses",
    emailMessage:
      '{"ops":[{"insert":"Thank you for using the Christian Life Survey to reflect on your spiritual journey!\\n\\nYour personal results are attached! \\n\\nThe results provided highlight the center points of your spiritual life, the ways you tend to live out the Christian life, and information about how you use scripture. There are links provided to scripture engagement resources that are best suited for someone with your center points and ways of living out your Christianity. (This includes links to web sites. Your anti-virus software might remove those links so we have included them as web addresses you can copy and paste if you wish to use them.)\\n\\nWe hope these results help you in your efforts to always engage more fully with God!\\n\\nThanks!\\n\\nSteve Bird, Phil Collins, and all the staff\\nTaylor University Center for Scripture Engagement\\n\\n\\n"},{"attributes":{"italic":true},"insert":"Please do not use this email address to contact us. This email is sent from an email address we only use to send out CLS results. We don\'t monitor it for replies."},{"insert":"\\n"}]}',
    created: "2020-05-13 13:11:51.390327",
    updated: "2020-07-21 14:25:06.522352",
  },
  {
    id: 11,
    title: "CLS 2020 Group",
    description: "CLS 2020 letter for group responses",
    emailMessage:
      '{"ops":[{"insert":"Thank you for using the Christian Life Group Survey ...\\n\\nYour personal results are attached! \\n\\nThe results provided highlight the center points of your spiritual life, the ways you tend to live out the Christian life, and information about how you use scripture. There are links provided to scripture engagement resources that are best suited for someone with your center points and ways of living out your Christianity. (This includes links to web sites. Your anti-virus software might remove those links so we have included them as web addresses you can copy and paste if you wish to use them.)\\n\\nWe hope these results help you in your efforts to always engage more fully with God!\\n\\nThanks!\\n\\nSteve Bird, Phil Collins, and all the staff\\nTaylor University Center for Scripture Engagement\\n\\n\\n"},{"attributes":{"italic":true},"insert":"Please do not use this email address to contact us. This email is sent from an email address we only use to send out CLS results. We don\'t monitor it for replies."},{"insert":"\\n"}]}',
    created: "2020-05-13 13:11:51.390327",
    updated: "2020-07-21 14:25:06.522352",
  },
];
