import { getDebugger } from "@helpers/debug-factory";
import { AbstractFixture } from "../abstract-fixture";
import { LetterElementModel } from "../../models/letter-element.model";
import { LetterElementTypeModel } from "../../models/letter-element-type.model";

const debug = getDebugger("fixture:letter-element");

export class LetterElementsFixture extends AbstractFixture {
  delete() {
    debug("Delete letter elements");
    return LetterElementModel.query().delete();
  }

  async insert() {
    debug("Load element IDs");

    // const typeNameToId = new Map<string, number>();
    // const elementTypes = await LetterElementTypeModel.query();
    // elementTypes.forEach((element) =>
    //   typeNameToId.set(element.key, element.id)
    // );
    // debug("element types %O", elementTypes);
    // debug("element map %O", typeNameToId);
    //
    // const fixed = letterElements.map((element) => {
    //   element["letterElementTypeId"] = typeNameToId.get(
    //     element._letterElementName
    //   );
    //   delete element._letterElementName;
    //   return element;
    // });
    // debug("updated elements %O", fixed);

    const fixed = await this.updateFromTypeModel(
      LetterElementTypeModel,
      letterElements,
      "_letterElementName",
      "letterElementTypeId"
    );

    debug("Insert letter elements");
    return LetterElementModel.query().insert(fixed);
  }
}

const letterElements = [
  {
    id: 135,
    sequence: 16,
    textDelta:
      '{"ops":[{"attributes":{"bold":true},"insert":"Thank you!"},{"insert":"\\n\\nWe hope that the Christian Life Survey has provided you with a way to revisit who you are as a Christian. We at the Center for Scripture Engagement at Taylor University wish you the very best as you continue your spiritual journey!\\n"}]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "boilerplate-text",
    surveyDimensionId: null,
  },
  {
    id: 129,
    sequence: 12,
    textDelta: '{"ops":[]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "dimension-chart",
    surveyDimensionId: 30,
  },
  {
    id: 132,
    sequence: 10,
    textDelta: '{"ops":[]}',
    imageId: 24,
    letterId: 10,
    _letterElementName: "image",
    surveyDimensionId: null,
  },
  {
    id: 133,
    sequence: 13,
    textDelta:
      '{"ops":[{"attributes":{"bold":true},"insert":"Scripture engagement techniques for you."},{"insert":"\\n\\nWe created the Christian Life Survey so that we can help you in your Christian walk. And an important part of any Christian’s walk is time spent in Scripture. It provides a foundation for our faith and the personal words of God to His people. But many people have difficulty engaging with the Bible, others have read it for so many years they feel too familiar, and others are so new to the faith that they don’t understand the Bible at all.\\n\\nWe want to help out in all of those areas.\\n\\nThat’s why knowing the centers of your spiritual life and your Christian lifestyles helps us. We can use your survey results and the insights we’ve gained from previous years of research to recommend some types of Scripture engagement that you might find particularly appealing. \\n\\nBased on your specific spiritual centers and your spiritual lifestyles, these are the forms of Scripture engagement our research suggests might be particularly appealing to you. Click on the titles below. They are links that will take you to web pages that will show you ways to engage with Scripture that might be particularly valuable for you. If you have high values on many of the spiritual centers, and lifestyles, you will have many suggestions because our research indicates that many approaches might appeal to you. If you have high values on fewer spiritual centers and lifestyles, there will be fewer suggestions for you!\\n"}]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "boilerplate-text",
    surveyDimensionId: null,
  },
  {
    id: 120,
    sequence: 1,
    textDelta: '{"ops":[]}',
    imageId: 21,
    letterId: 10,
    _letterElementName: "image",
    surveyDimensionId: null,
  },
  {
    id: 122,
    sequence: 3,
    textDelta: '{"ops":[]}',
    imageId: 22,
    letterId: 10,
    _letterElementName: "image",
    surveyDimensionId: null,
  },
  {
    id: 117,
    sequence: 2,
    textDelta:
      '{"ops":[{"attributes":{"bold":true},"insert":"These are your results for the Christian Life Survey."},{"insert":"\\n\\nThe Christian Life Survey helps you answer three important questions:\\n\\nWhat is at the center of my spiritual life? How do I live out my Christianity? How do I engage with Scripture?\\n\\nIt’s important to remember that this survey captures a moment in time in your Christian walk. This particular moment when you are taking this survey. If you were to have taken it several years ago or if you take it again years into the future, your answers might be different. \\n\\nThe point of these results is to help you see how you’re living your faith now so you can decide if you might want to make adjustments in order to draw closer to God, to grow spiritually, and to have your faith impact your world.\\n"}]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "boilerplate-text",
    surveyDimensionId: null,
  },
  {
    id: 130,
    sequence: 9,
    textDelta: '{"ops":[]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "dimension-chart",
    surveyDimensionId: 29,
  },
  {
    id: 127,
    sequence: 8,
    textDelta: '{"ops":[]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "dimension-chart",
    surveyDimensionId: 28,
  },
  {
    id: 131,
    sequence: 6,
    textDelta: '{"ops":[]}',
    imageId: 23,
    letterId: 10,
    _letterElementName: "image",
    surveyDimensionId: null,
  },
  {
    id: 125,
    sequence: 5,
    textDelta: '{"ops":[]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "dimension-chart",
    surveyDimensionId: 27,
  },
  {
    id: 190,
    sequence: 14,
    textDelta: '{"ops":[]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "scripture-engagement-prediction",
    surveyDimensionId: null,
  },
  {
    id: 134,
    sequence: 15,
    textDelta: '{"ops":[]}',
    imageId: 25,
    letterId: 10,
    _letterElementName: "image",
    surveyDimensionId: null,
  },
  {
    id: 126,
    sequence: 7,
    textDelta:
      '{"ops":[{"attributes":{"bold":true},"insert":"How do you live out your Christianity?"},{"insert":"\\n\\nThe Christian Life Survey allows you to self-assess your adoption of any of six different spiritual lifestyles. You can be high or low on any combination of them. Being high or low on any particular Christian lifestyle does not make you a better or worse Christian; instead, the score is meant to help you understand how you are living out your spirituality.\\nUse your personal results (shown in the bar chart below) to begin thinking about who you want to be as a Christian and if your lifestyles need to change.\\n\\nFor the lifestyles with the higher numbers, you can ask yourself how you want to lean into those orientations to better know God, serve the kingdom, and grow spiritually. If you have a score of 5 or higher on any lifestyle, it means it is a lifestyle that defines your way of living the Christian life--it is a lifestyle that you pay attention to and engage in. If you have a value of three or lower, it just means you do not pay attention to that way of living out your spirituality and do not engage in it. It doesn\'t mean you have a problem (you might or you might not), it just means you do not engage in that lifestyle regularly. You might want to ask why you have lower numbers on some lifestyles—and whether you want to make that orientation more important for how you live the Christian life. Knowing your spiritual lifestyles is a way to know yourself as a Christian and use that knowledge to grow.\\n\\nHere are the six Christian lifestyles the survey looks at.\\n\\n"},{"attributes":{"bold":true},"insert":"Connected"},{"insert":": Christians who adopt this lifestyle tend to be “plugged in.” They regularly are involved in worship services, small groups, fellowship with other Christians, and other collective times of spiritual growth and experience.\\n\\n"},{"attributes":{"bold":true},"insert":"Evangelism"},{"insert":": Christians who have high scores in evangelism are actively engaged in evangelistic efforts. \\n\\n"},{"attributes":{"bold":true},"insert":"Reflective"},{"insert":": Christians who have high scores in reflection are more meditative and thoughtful about their spirituality. \\n\\n"},{"attributes":{"bold":true},"insert":"Service"},{"insert":": Christians who have high scores for this lifestyle are regularly involved in efforts to help those who are in difficult situations. \\n\\n"},{"attributes":{"bold":true},"insert":"Appetite discipline"},{"insert":": Christians who have high scores in this lifestyle are self-consciously engaged with a healthy control of their appetites (for approval, sex, fame, and many other things).\\n\\n"},{"attributes":{"bold":true},"insert":"Stewardship discipline"},{"insert":": Christians who have high scores for this lifestyle pursue a healthy relationship to their resources (income, time, talents, etc.).\\n"}]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "boilerplate-text",
    surveyDimensionId: null,
  },
  {
    id: 128,
    sequence: 11,
    textDelta:
      '{"ops":[{"attributes":{"bold":true},"insert":"How do you engage with Scripture?"},{"insert":"\\n\\nPeople approach the Bible in many different ways. The Christian Life Survey let\'s you look at six different ways you might be engaging with the Bible. Consider if you want to add more of these to your regular Bible times!\\n\\n"},{"attributes":{"bold":true},"insert":"Experience God:"},{"insert":" You approach the Bible as a way to experience the presence of God.\\n\\n"},{"attributes":{"bold":true},"insert":"Study"},{"insert":": You approach the Bible to learn.\\n\\n"},{"attributes":{"bold":true},"insert":"Affective"},{"insert":": You connect the Bible to your aspirations, passions, and feelings.\\n\\n"},{"attributes":{"bold":true},"insert":"Personal Application"},{"insert":": You approach the Bible as a way to learn how to behave.\\n\\n"},{"attributes":{"bold":true},"insert":"Identity"},{"insert":": You approach the Bible as a way to shape your understanding of who you are in the great story of God.\\n\\n"},{"attributes":{"bold":true},"insert":"Society Application"},{"insert":": You approach the Bible so you can apply it to people and society.\\n\\nThe chart below shows which of these approaches you tend to use. \\n"}]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "boilerplate-text",
    surveyDimensionId: null,
  },
  {
    id: 124,
    sequence: 4,
    textDelta:
      '{"ops":[{"attributes":{"bold":true},"insert":"What is at the center of your spiritual life?"},{"insert":"\\n\\nLike planets revolve around the sun, we, spiritually, revolve around something. Something is at the center of our spiritual lives and we are guided by it. Scripture tells us that the Christian life is to be centered on God (Matthew 22:37), the Bible (2 Timothy 3:16), and others (Matthew 22:39). At this moment in your life you could have all of these, a few of these, or none of these at the center of your spiritual life. So, in the chart below, you might be high (or low) on all of them, just some of them, or none of them. \\n\\nAs you consider your personal results (shown below), note that the higher the score, the more important something is for your spiritual life. A score of 5 or higher indicates that this is at the center of your spiritual life. A score around 4 indicates that you are ambivalent about this one, and anything with a score of 3 or lower is not near the center of your Christian life.\\n\\nWhile it is generally assumed that a Christian will seek to have higher scores on all three of these (God at the center, the Bible at the center, and others at the center), there are times in your spiritual journey when you will be low on one or more of them. That is okay. Remember, this is simply an assessment to help you along your spiritual journey. For example, a person who is low on all three areas, might be just beginning the Christian journey or might be a person reassessing their spiritual identity. Whether you are high or low on none of them, one of them, two of them, or all of them, this is a chance to think about what is at the center of your Christian life and let that guide who you are becoming.\\n"}]}',
    imageId: null,
    letterId: 10,
    _letterElementName: "boilerplate-text",
    surveyDimensionId: null,
  },
];
