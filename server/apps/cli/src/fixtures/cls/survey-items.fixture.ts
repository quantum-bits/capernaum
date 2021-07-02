import { AbstractFixture } from "../abstract-fixture";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyItemModel } from "../../models/survey-item.model";

const debug = getDebugger("fixture:survey-item");

export class SurveyItemsFixture extends AbstractFixture {
  delete() {
    debug("Delete survey items");
    return SurveyItemModel.query().delete();
  }

  insert(update) {
    debug("Insert survey items");
    return SurveyItemModel.query().insert(
      this.updateFromOptions(surveyItems, update)
    );
  }
}

const surveyItems = [
  {
    id: 471,
    surveyIndexId: null,
    qualtricsId: "QID7",
    qualtricsText: "I read the Bible",
    surveyId: 38,
  },
  {
    id: 553,
    surveyIndexId: null,
    qualtricsId: "QID118",
    qualtricsText:
      "Everyone should have the freedom to live in whatever ways express their unique identity.",
    surveyId: 38,
  },
  {
    id: 554,
    surveyIndexId: null,
    qualtricsId: "QID119",
    qualtricsText: "Everyone should have the same rights and freedoms.",
    surveyId: 38,
  },
  {
    id: 555,
    surveyIndexId: null,
    qualtricsId: "QID120",
    qualtricsText:
      "Everyone should obey the authority of the people in charge.",
    surveyId: 38,
  },
  {
    id: 556,
    surveyIndexId: null,
    qualtricsId: "QID121",
    qualtricsText:
      "Most of the time, we can be completely certain that we know how physical, social, and theological reality works.",
    surveyId: 38,
  },
  {
    id: 557,
    surveyIndexId: null,
    qualtricsId: "QID122",
    qualtricsText:
      "In general, what we think we know for certain about physical, social, or theological reality, might actually be wrong.",
    surveyId: 38,
  },
  {
    id: 558,
    surveyIndexId: null,
    qualtricsId: "QID123",
    qualtricsText: "Reality almost always works in a predictable, logical way.",
    surveyId: 38,
  },
  {
    id: 559,
    surveyIndexId: null,
    qualtricsId: "QID124",
    qualtricsText:
      "Reality works in complicated ways and often turns out differently than expected.",
    surveyId: 38,
  },
  {
    id: 560,
    surveyIndexId: null,
    qualtricsId: "QID125",
    qualtricsText:
      "We should only follow and support people who believe the things we know are true.",
    surveyId: 38,
  },
  {
    id: 475,
    surveyIndexId: null,
    qualtricsId: "QID11",
    qualtricsText: "I pray",
    surveyId: 38,
  },
  {
    id: 485,
    surveyIndexId: null,
    qualtricsId: "QID21",
    qualtricsText: "I have times of solitude to increase my spiritual life",
    surveyId: 38,
  },
  {
    id: 486,
    surveyIndexId: null,
    qualtricsId: "QID22",
    qualtricsText:
      "I practice important times of silence as part of my spiritual practices",
    surveyId: 38,
  },
  {
    id: 487,
    surveyIndexId: null,
    qualtricsId: "QID23",
    qualtricsText:
      "I intentionally practice submission of self to a spiritual purpose",
    surveyId: 38,
  },
  {
    id: 488,
    surveyIndexId: null,
    qualtricsId: "QID24",
    qualtricsText:
      "I make serious sacrifices in the ways I live so I can grow spiritually",
    surveyId: 38,
  },
  {
    id: 506,
    surveyIndexId: null,
    qualtricsId: "QID43",
    qualtricsText:
      "Jesus' death is the only way the penalty for sin could be removed",
    surveyId: 38,
  },
  {
    id: 507,
    surveyIndexId: null,
    qualtricsId: "QID44",
    qualtricsText:
      "Only accepting the grace provided by Jesus can lead to salvation",
    surveyId: 38,
  },
  {
    id: 494,
    surveyIndexId: 73,
    qualtricsId: "QID31",
    qualtricsText: "What God says is what is true, right, and good",
    surveyId: 38,
  },
  {
    id: 495,
    surveyIndexId: 73,
    qualtricsId: "QID32",
    qualtricsText: "I want God to be pleased with me",
    surveyId: 38,
  },
  {
    id: 496,
    surveyIndexId: 73,
    qualtricsId: "QID33",
    qualtricsText: "I believe God is actively involved in my life",
    surveyId: 38,
  },
  {
    id: 497,
    surveyIndexId: 73,
    qualtricsId: "QID34",
    qualtricsText: "I believe the God of the Bible is the one true God",
    surveyId: 38,
  },
  {
    id: 498,
    surveyIndexId: 74,
    qualtricsId: "QID35",
    qualtricsText: "I live in ways that help others as much as myself",
    surveyId: 38,
  },
  {
    id: 499,
    surveyIndexId: 74,
    qualtricsId: "QID36",
    qualtricsText:
      "I go out of my way to discover the people in need around me that I normally wouldn't see",
    surveyId: 38,
  },
  {
    id: 500,
    surveyIndexId: 74,
    qualtricsId: "QID37",
    qualtricsText: "I have tremendous love for people I don't know",
    surveyId: 38,
  },
  {
    id: 501,
    surveyIndexId: 74,
    qualtricsId: "QID38",
    qualtricsText:
      "I think about strangers' well-being and want what is best for them",
    surveyId: 38,
  },
  {
    id: 502,
    surveyIndexId: 75,
    qualtricsId: "QID39",
    qualtricsText:
      "I believe the Bible has decisive authority over what I say and do",
    surveyId: 38,
  },
  {
    id: 503,
    surveyIndexId: 75,
    qualtricsId: "QID40",
    qualtricsText:
      "As I go through a normal day I think of Bible passages relevant to what I am doing",
    surveyId: 38,
  },
  {
    id: 504,
    surveyIndexId: 75,
    qualtricsId: "QID41",
    qualtricsText: "I talk about Bible passages with my friends",
    surveyId: 38,
  },
  {
    id: 505,
    surveyIndexId: 75,
    qualtricsId: "QID42",
    qualtricsText: "The Bible is an important part of my daily life",
    surveyId: 38,
  },
  {
    id: 472,
    surveyIndexId: 76,
    qualtricsId: "QID8",
    qualtricsText: "I worship God",
    surveyId: 38,
  },
  {
    id: 473,
    surveyIndexId: 76,
    qualtricsId: "QID9",
    qualtricsText: "I attend worship services",
    surveyId: 38,
  },
  {
    id: 474,
    surveyIndexId: 76,
    qualtricsId: "QID10",
    qualtricsText: "I engage in fellowship with Christians",
    surveyId: 38,
  },
  {
    id: 476,
    surveyIndexId: 76,
    qualtricsId: "QID12",
    qualtricsText: "I meet with a spiritual small group or spiritual mentor",
    surveyId: 38,
  },
  {
    id: 477,
    surveyIndexId: 77,
    qualtricsId: "QID13",
    qualtricsText:
      "I talk to non-believers in ways that I think will help them come closer to Christ",
    surveyId: 38,
  },
  {
    id: 478,
    surveyIndexId: 77,
    qualtricsId: "QID14",
    qualtricsText:
      "I go out of my way to be in contact with people who don't share my beliefs",
    surveyId: 38,
  },
  {
    id: 479,
    surveyIndexId: 77,
    qualtricsId: "QID15",
    qualtricsText:
      "I act in specific ways around non-believers so they might come closer to Christ",
    surveyId: 38,
  },
  {
    id: 480,
    surveyIndexId: 77,
    qualtricsId: "QID16",
    qualtricsText: "I try to evangelize others so they will become Christians",
    surveyId: 38,
  },
  {
    id: 489,
    surveyIndexId: 78,
    qualtricsId: "QID25",
    qualtricsText: "I reflect on what it means for me to be a Christian",
    surveyId: 38,
  },
  {
    id: 490,
    surveyIndexId: 78,
    qualtricsId: "QID26",
    qualtricsText: "I reflect on the meaning of scripture in my life",
    surveyId: 38,
  },
  {
    id: 491,
    surveyIndexId: 78,
    qualtricsId: "QID27",
    qualtricsText: "I reflect on the meaning of prayer in my life",
    surveyId: 38,
  },
  {
    id: 492,
    surveyIndexId: 78,
    qualtricsId: "QID28",
    qualtricsText: "I reflect on what is good and right",
    surveyId: 38,
  },
  {
    id: 493,
    surveyIndexId: 78,
    qualtricsId: "QID29",
    qualtricsText: "I reflect on who God is",
    surveyId: 38,
  },
  {
    id: 481,
    surveyIndexId: 79,
    qualtricsId: "QID17",
    qualtricsText: "I serve those in need",
    surveyId: 38,
  },
  {
    id: 482,
    surveyIndexId: 79,
    qualtricsId: "QID18",
    qualtricsText: "I serve the people around me",
    surveyId: 38,
  },
  {
    id: 483,
    surveyIndexId: 79,
    qualtricsId: "QID19",
    qualtricsText: "I help people who are treated unjustly",
    surveyId: 38,
  },
  {
    id: 484,
    surveyIndexId: 79,
    qualtricsId: "QID20",
    qualtricsText: "I help others who are in difficulty",
    surveyId: 38,
  },
  {
    id: 508,
    surveyIndexId: 80,
    qualtricsId: "QID45",
    qualtricsText:
      "I make intentional disciplined efforts to maintain a healthy appetite toward sex",
    surveyId: 38,
  },
  {
    id: 509,
    surveyIndexId: 80,
    qualtricsId: "QID46",
    qualtricsText:
      "I make intentional disciplined efforts to maintain a healthy appetite toward food",
    surveyId: 38,
  },
  {
    id: 510,
    surveyIndexId: 80,
    qualtricsId: "QID47",
    qualtricsText:
      "I make intentional disciplined efforts to maintain a healthy appetite toward alcohol",
    surveyId: 38,
  },
  {
    id: 511,
    surveyIndexId: 80,
    qualtricsId: "QID48",
    qualtricsText:
      "I make intentional disciplined efforts to maintain a healthy appetite toward social approval",
    surveyId: 38,
  },
  {
    id: 512,
    surveyIndexId: 80,
    qualtricsId: "QID49",
    qualtricsText:
      "I make intentional disciplined efforts to maintain a healthy appetite toward wealth",
    surveyId: 38,
  },
  {
    id: 513,
    surveyIndexId: 80,
    qualtricsId: "QID50",
    qualtricsText:
      "I make intentional disciplined efforts to maintain a healthy appetite toward power and control",
    surveyId: 38,
  },
  {
    id: 514,
    surveyIndexId: 80,
    qualtricsId: "QID51",
    qualtricsText:
      "I make intentional disciplined efforts to maintain a healthy appetite toward fame",
    surveyId: 38,
  },
  {
    id: 526,
    surveyIndexId: 84,
    qualtricsId: "QID64",
    qualtricsText: "I let the passage redefine the story of my life",
    surveyId: 38,
  },
  {
    id: 539,
    surveyIndexId: null,
    qualtricsId: "QID94",
    qualtricsText: "Do you consider yourself to be spiritual?",
    surveyId: 38,
  },
  {
    id: 540,
    surveyIndexId: null,
    qualtricsId: "QID95",
    qualtricsText: "Do you consider yourself to be religious?",
    surveyId: 38,
  },
  {
    id: 542,
    surveyIndexId: null,
    qualtricsId: "QID109",
    qualtricsText:
      "Everyone should have the freedom to live in ways that express their unique identity.",
    surveyId: 38,
  },
  {
    id: 543,
    surveyIndexId: null,
    qualtricsId: "QID110",
    qualtricsText: "Everyone should have the same rights and freedoms.",
    surveyId: 38,
  },
  {
    id: 544,
    surveyIndexId: null,
    qualtricsId: "QID111",
    qualtricsText:
      "Everyone should respect the authority of the people in charge.",
    surveyId: 38,
  },
  {
    id: 545,
    surveyIndexId: null,
    qualtricsId: "QID112",
    qualtricsText:
      "In general, we can be certain that we know how reality works.",
    surveyId: 38,
  },
  {
    id: 546,
    surveyIndexId: null,
    qualtricsId: "QID113",
    qualtricsText:
      "In general, what we think we know for certain, might actually be wrong.",
    surveyId: 38,
  },
  {
    id: 547,
    surveyIndexId: null,
    qualtricsId: "QID114",
    qualtricsText: "Reality works in a predictable, logical way.",
    surveyId: 38,
  },
  {
    id: 548,
    surveyIndexId: null,
    qualtricsId: "QID115",
    qualtricsText:
      "Reality works in complicated ways that might turn out differently sometimes.",
    surveyId: 38,
  },
  {
    id: 549,
    surveyIndexId: null,
    qualtricsId: "QID116",
    qualtricsText:
      "There are some groups of people that should be followed instead of just following the people in charge.",
    surveyId: 38,
  },
  {
    id: 550,
    surveyIndexId: null,
    qualtricsId: "QID83",
    qualtricsText: "Your education?",
    surveyId: 38,
  },
  {
    id: 551,
    surveyIndexId: null,
    qualtricsId: "QID89",
    qualtricsText: "Political orientation?",
    surveyId: 38,
  },
  {
    id: 552,
    surveyIndexId: null,
    qualtricsId: "QID90",
    qualtricsText: "Your race/ethnicity?",
    surveyId: 38,
  },
  {
    id: 515,
    surveyIndexId: 81,
    qualtricsId: "QID52",
    qualtricsText:
      "I make intentional disciplined efforts to use my money for God's purposes",
    surveyId: 38,
  },
  {
    id: 516,
    surveyIndexId: 81,
    qualtricsId: "QID53",
    qualtricsText:
      "I make intentional disciplined efforts to use my time for God's purposes",
    surveyId: 38,
  },
  {
    id: 517,
    surveyIndexId: 81,
    qualtricsId: "QID54",
    qualtricsText:
      "I make intentional disciplined efforts to use my talents and skills for God's purposes",
    surveyId: 38,
  },
  {
    id: 518,
    surveyIndexId: 81,
    qualtricsId: "QID55",
    qualtricsText:
      "I make intentional disciplined efforts to use my freedoms for God's purposes",
    surveyId: 38,
  },
  {
    id: 519,
    surveyIndexId: 81,
    qualtricsId: "QID56",
    qualtricsText:
      "I make intentional disciplined efforts to use my privileges for God's purposes",
    surveyId: 38,
  },
  {
    id: 520,
    surveyIndexId: 81,
    qualtricsId: "QID57",
    qualtricsText:
      "I make intentional disciplined efforts to use my relationships for God's purposes",
    surveyId: 38,
  },
  {
    id: 527,
    surveyIndexId: 82,
    qualtricsId: "QID65",
    qualtricsText: "I connect the passage to my feelings",
    surveyId: 38,
  },
  {
    id: 528,
    surveyIndexId: 82,
    qualtricsId: "QID66",
    qualtricsText: "I look in the passage for the motivations I should have",
    surveyId: 38,
  },
  {
    id: 529,
    surveyIndexId: 82,
    qualtricsId: "QID67",
    qualtricsText: "I let the passage shape my hopes and dreams",
    surveyId: 38,
  },
  {
    id: 533,
    surveyIndexId: 83,
    qualtricsId: "QID71",
    qualtricsText:
      "I experience the presence of God through interaction with the passage",
    surveyId: 38,
  },
  {
    id: 534,
    surveyIndexId: 83,
    qualtricsId: "QID72",
    qualtricsText: "I am moved by the Spirit as I interact with the passage",
    surveyId: 38,
  },
  {
    id: 535,
    surveyIndexId: 83,
    qualtricsId: "QID73",
    qualtricsText: "I know God more deeply through the passage",
    surveyId: 38,
  },
  {
    id: 524,
    surveyIndexId: 84,
    qualtricsId: "QID62",
    qualtricsText: "I put myself personally into the passage",
    surveyId: 38,
  },
  {
    id: 525,
    surveyIndexId: 84,
    qualtricsId: "QID63",
    qualtricsText:
      "I look for the larger story in the passage and where I fit in it",
    surveyId: 38,
  },
  {
    id: 536,
    surveyIndexId: 85,
    qualtricsId: "QID74",
    qualtricsText: "I think carefully about the meaning of the passage",
    surveyId: 38,
  },
  {
    id: 537,
    surveyIndexId: 85,
    qualtricsId: "QID75",
    qualtricsText: "I study the facts in the passage",
    surveyId: 38,
  },
  {
    id: 538,
    surveyIndexId: 85,
    qualtricsId: "QID76",
    qualtricsText: "I think about what the passage tells me to believe",
    surveyId: 38,
  },
  {
    id: 522,
    surveyIndexId: 86,
    qualtricsId: "QID60",
    qualtricsText: "I try to live out what the passage teaches me",
    surveyId: 38,
  },
  {
    id: 523,
    surveyIndexId: 86,
    qualtricsId: "QID61",
    qualtricsText: "I look for things the passage is telling me to do",
    surveyId: 38,
  },
  {
    id: 521,
    surveyIndexId: 86,
    qualtricsId: "QID59",
    qualtricsText: "I apply the passage to my life",
    surveyId: 38,
  },
  {
    id: 530,
    surveyIndexId: 87,
    qualtricsId: "QID68",
    qualtricsText: "I reflect on what the passage means for others and society",
    surveyId: 38,
  },
  {
    id: 531,
    surveyIndexId: 87,
    qualtricsId: "QID69",
    qualtricsText:
      "I try to learn what the passage says about justice for everyone",
    surveyId: 38,
  },
  {
    id: 532,
    surveyIndexId: 87,
    qualtricsId: "QID70",
    qualtricsText:
      "I think about God's response to all humankind (not just me or people close to me) from the passage",
    surveyId: 38,
  },
  {
    id: 541,
    surveyIndexId: 88,
    qualtricsId: "QID93",
    qualtricsText: "Do you consider yourself to be a Christian?",
    surveyId: 38,
  },
];
