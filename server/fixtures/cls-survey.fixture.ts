const predictionTableEntries = [
  {
    id: 201,
    letterId: 10,
    surveyIndexId: 88,
    practiceId: 16,
    sequence: 10,
  },
  {
    id: 202,
    letterId: 10,
    surveyIndexId: 88,
    practiceId: 17,
    sequence: 10,
  },
  {
    id: 181,
    letterId: 10,
    surveyIndexId: 73,
    practiceId: 2,
    sequence: 10,
  },
  {
    id: 185,
    letterId: 10,
    surveyIndexId: 73,
    practiceId: 4,
    sequence: 10,
  },
  {
    id: 193,
    letterId: 10,
    surveyIndexId: 73,
    practiceId: 9,
    sequence: 10,
  },
  {
    id: 189,
    letterId: 10,
    surveyIndexId: 79,
    practiceId: 7,
    sequence: 10,
  },
  {
    id: 192,
    letterId: 10,
    surveyIndexId: 79,
    practiceId: 8,
    sequence: 10,
  },
  {
    id: 200,
    letterId: 10,
    surveyIndexId: 79,
    practiceId: 13,
    sequence: 10,
  },
  {
    id: 186,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 4,
    sequence: 10,
  },
  {
    id: 190,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 8,
    sequence: 10,
  },
  {
    id: 194,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 9,
    sequence: 10,
  },
  {
    id: 195,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 10,
    sequence: 10,
  },
  {
    id: 198,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 13,
    sequence: 10,
  },
  {
    id: 180,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 1,
    sequence: 10,
  },
  {
    id: 182,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 2,
    sequence: 10,
  },
  {
    id: 188,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 6,
    sequence: 10,
  },
  {
    id: 197,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 11,
    sequence: 10,
  },
  {
    id: 183,
    letterId: 10,
    surveyIndexId: 78,
    practiceId: 2,
    sequence: 10,
  },
  {
    id: 184,
    letterId: 10,
    surveyIndexId: 78,
    practiceId: 3,
    sequence: 10,
  },
  {
    id: 196,
    letterId: 10,
    surveyIndexId: 78,
    practiceId: 10,
    sequence: 10,
  },
  {
    id: 187,
    letterId: 10,
    surveyIndexId: 74,
    practiceId: 5,
    sequence: 10,
  },
  {
    id: 191,
    letterId: 10,
    surveyIndexId: 74,
    practiceId: 8,
    sequence: 10,
  },
  {
    id: 199,
    letterId: 10,
    surveyIndexId: 74,
    practiceId: 13,
    sequence: 10,
  },
];

const surveyIndexes = [
  {
    id: 88,
    surveyDimensionId: 26,
    abbreviation: "Christian",
    title: "Christian",
    useForPredictions: true,
  },
  {
    id: 73,
    surveyDimensionId: 27,
    abbreviation: "Centered on God",
    title: "Centered on God",
    useForPredictions: true,
  },
  {
    id: 79,
    surveyDimensionId: 28,
    abbreviation: "Service",
    title: "Service",
    useForPredictions: true,
  },
  {
    id: 80,
    surveyDimensionId: 29,
    abbreviation: "Appetite Discipline",
    title: "Appetite Discipline",
    useForPredictions: false,
  },
  {
    id: 75,
    surveyDimensionId: 27,
    abbreviation: "Centered on the Bible",
    title: "Centered on the Bible",
    useForPredictions: true,
  },
  {
    id: 76,
    surveyDimensionId: 28,
    abbreviation: "Connected",
    title: "Connected",
    useForPredictions: true,
  },
  {
    id: 77,
    surveyDimensionId: 28,
    abbreviation: "Evangelistic",
    title: "Evangelistic",
    useForPredictions: false,
  },
  {
    id: 78,
    surveyDimensionId: 28,
    abbreviation: "Reflective",
    title: "Reflective",
    useForPredictions: true,
  },
  {
    id: 81,
    surveyDimensionId: 29,
    abbreviation: "Stewardship",
    title: "Stewardship",
    useForPredictions: false,
  },
  {
    id: 82,
    surveyDimensionId: 30,
    abbreviation: "Affective",
    title: "Affective",
    useForPredictions: false,
  },
  {
    id: 83,
    surveyDimensionId: 30,
    abbreviation: "Experience God",
    title: "Experience God",
    useForPredictions: true,
  },
  {
    id: 84,
    surveyDimensionId: 30,
    abbreviation: "Identity",
    title: "Identity",
    useForPredictions: false,
  },
  {
    id: 85,
    surveyDimensionId: 30,
    abbreviation: "Intellect",
    title: "Intellect",
    useForPredictions: false,
  },
  {
    id: 86,
    surveyDimensionId: 30,
    abbreviation: "Personal Application",
    title: "Personal Application",
    useForPredictions: false,
  },
  {
    id: 74,
    surveyDimensionId: 27,
    abbreviation: "Centered on Others",
    title: "Centered on Others",
    useForPredictions: true,
  },
  {
    id: 87,
    surveyDimensionId: 30,
    abbreviation: "Societal Application",
    title: "Societal Application",
    useForPredictions: true,
  },
];

const surveyDimensions = [
  {
    id: 26,
    surveyId: 10,
    title: "Additional",
    sequence: 10,
  },
  {
    id: 27,
    surveyId: 10,
    title: "Centers",
    sequence: 10,
  },
  {
    id: 28,
    surveyId: 10,
    title: "Ways of life",
    sequence: 10,
  },
  {
    id: 29,
    surveyId: 10,
    title: "Disciplines",
    sequence: 10,
  },
  {
    id: 30,
    surveyId: 10,
    title: "Bible engagement",
    sequence: 10,
  },
];

const scriptureEngagementPractices = [
  {
    id: 10,
    title: "Hand Copying Scripture",
    description:
      "Hand copying Scripture is simply writing passages of Scripture by hand word-for-word. Writing the Bible by hand offers the unique opportunity to participate in an activity that forces you to slow down the process of reading and encourages a more reflective engagement with God’s Word. It gives more time to think about what you’re writing and to dwell on the meaning and implications of a passage. Hand copying is a focusing activity that combats quick, surface-level reading. Copying is also an aid to memory and helps you to perceive details in a passage that you might overlook otherwise.\n(https://www.biblegateway.com/resources/scripture-engagement/hand-copying-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/hand-copying-scripture/home",
    sequence: 10,
  },
  {
    id: 2,
    title: "Praying Scripture",
    description:
      "Engaging the Bible and praying are the primary methods for developing a deepening relationship with God. While many tend to think of prayer and Bible reading as separate spiritual practices (e.g., first pray, then read the Bible), they can be even more powerful when combined into one practice of “praying Scripture.” Numerous ways to pray Scripture are explored in this method of Scripture engagement.\n(https://www.biblegateway.com/resources/scripture-engagement/praying-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/praying-scripture/home",
    sequence: 2,
  },
  {
    id: 4,
    title: "Journaling Scripture",
    description:
      "A Scripture journal is a conversation with God. It is meant to be a place where you can safely record and reflect on your raw thoughts and feelings, ask questions, search for patterns, and develop your own thoughts with the Holy Spirit as your guide. Being candid with both God and yourself deeply enhances spiritual growth. Confession to God results in an open and honest relationship with him that allows the Spirit to continue to shape and mold you into Christ’s image. \n(https://www.biblegateway.com/resources/scripture-engagement/journaling-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/journaling-scripture/home",
    sequence: 4,
  },
  {
    id: 5,
    title: "Engage Through Art",
    description:
      "Images connect with our emotions and can convey deep truths; they can be powerful triggers to help remember the stories and connect with the truths of the Bible. A good piece of biblical art can give “fresh eyes” for familiar passages. The artist becomes your companion who points out details of a passage that you might have passed over in merely reading. Since art is often complicated and takes time to understand, it requires you to slow down and helps you meditate on a passage. In the presence of the Holy Spirit, you combine the resource of art and the inspired words of the Bible, allowing you to encounter the God of the Bible in a new way.\n(https://www.biblegateway.com/resources/scripture-engagement/art/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/art/home",
    sequence: 5,
  },
  {
    id: 6,
    title: "Contemplate",
    description:
      "Contemplating a passage of Scripture is a long-standing spiritual practice in the church, often called Lectio Divina (Latin for “sacred reading”). The four traditional stages of contemplation are reading, meditation, prayer, and contemplation. The steps were created simply to provide structure and guidance for people who wish to learn how to perform this practice. Contemplation is best practiced with passages that you have at least some familiarity with; it is not intended to introduce you to something new in the Bible. The purpose of contemplating Scripture is to allow you to experience it and reflect more deeply on what you know.\n(https://www.biblegateway.com/resources/scripture-engagement/lectio-divina/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/lectio-divina/home",
    sequence: 6,
  },
  {
    id: 7,
    title: "Storying Scripture",
    description:
      "In storying, a teacher tells a Bible story by memory to a group of people. The listeners then retell the story together back to the teacher as best as they can. The teacher than tells the story again until all of the listeners have the story in their memory. The group then discusses the story and relates their own lives to the story. The goal is for the listeners to learn the story so they can share it with others, in a sense becoming walking, talking Bibles. Storying is a particularly powerful means of engaging Scripture in a small group setting. Storying cultivates interaction among the group members as they come together to try to retell the story.\n(https://www.biblegateway.com/resources/scripture-engagement/storying-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/storying-scripture/home",
    sequence: 7,
  },
  {
    id: 8,
    title: "Speaking Scripture",
    description:
      "We are created for community and wired to speak with others. The things in our lives that are on our hearts naturally come out in our conversations, and those conversations result in our turning those ideas over in our minds (in other words, what we talk about often leads to what we think/meditate about). A consistent theme in the Bible is that God tells us to speak to others about what he has said to us—we aren’t to keep his Word to ourselves. Instead, his Word is to be on our lips, and we are to speak Scripture to one another. By speaking about Scripture with other people, you will deepen your connection with God’s Word. \n(https://www.biblegateway.com/resources/scripture-engagement/speaking-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/speaking-scripture/home",
    sequence: 8,
  },
  {
    id: 9,
    title: "Memorizing Scripture",
    description:
      "Memorizing Scripture is one of the most effective means of Scripture engagement. Because Scripture engagement is about reflecting on the Bible and mulling a passage over in our minds, having a passage memorized makes the process of reflection available to you at all times. Memorized Scripture allows you to dwell continuously on a passage throughout the day. Suggestions for what to memorize and how are given in this section.\n(https://www.biblegateway.com/resources/scripture-engagement/scripture-memorization/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/scripture-memorization/home",
    sequence: 9,
  },
  {
    id: 1,
    title: "Singing Scripture",
    description:
      "Singing the truths in the Bible enhances your experience with God through his Word both emotionally and cognitively. Excellent music stirs our hearts, enhancing the feelings that are associated with the message of the lyrics. The lyrics of songs are poetry, and poetry, because of its extensive imagery, also helps us feel the truth of a message in a powerful way. Singing Scriptures can deepen your thinking about God by helping you meditate on God’s truth. In addition, the power of song to help you remember is irrefutable. \n(https://www.biblegateway.com/resources/scripture-engagement/singing-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/singing-scripture/home",
    sequence: 1,
  },
  {
    id: 3,
    title: "Picture It",
    description:
      "The Picture It method of Scripture engagement (also sometimes called Imaginative Contemplation or the Ignatian Method) gives you the opportunity to engage your imagination. God has given us the biblical stories so we can connect with them on all levels, learning who he is and what he cares about. In this method, you place yourself in the stories of Scripture in an attempt to better empathize with the people of the Bible and “experience” their stories. With the Picture It method, you are no longer just reading a book—you are living a story. This is especially helpful for those who tend to connect to Scripture on a purely cognitive level, allowing them to experience more of the emotion of the text.\n(https://www.biblegateway.com/resources/scripture-engagement/ignatian-method/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/ignatian-method/home",
    sequence: 3,
  },
  {
    id: 11,
    title: "Manuscript Bible Study",
    description:
      "The Manuscript Bible Study method is a small group Scripture engagement practice that has been around for over 60 years. People gather together to observe a passage where they see more details as a community than they would as individuals. Individuals first mark their manuscript (a printed version of a passage), looking for key words, promises, contrasts/comparisons, illustrations, repetition of ideas, structure of the passage, connections, etc. They also develop questions they have about the passage. The group then shares their observations and questions and works together to answer those questions from the Bible. The group then processes and applies the passage together.\n(https://www.biblegateway.com/resources/scripture-engagement/manuscript-bible-study/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/manuscript-bible-study/home",
    sequence: 11,
  },
  {
    id: 13,
    title: "Public Reading of Scripture",
    description:
      "The Bible was meant to be read, but it was also meant to be heard. To hear someone read Scripture is a different experience than to simply read silently to yourself. A well-prepared and gifted reader can bring out meaning in a text through voice inflection, rhythm, and intonation. A talented reader can present the Word of God to a group or congregation so that the listeners experience the Bible in a rich and powerful manner. Suggestions for reading the selected passage out loud (either by yourself or with other people) are given in this section.\n(https://www.biblegateway.com/resources/scripture-engagement/public-reading-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/public-reading-scripture/home",
    sequence: 13,
  },
  {
    id: 16,
    title: "The Abide Bible",
    description:
      "The Abide Bible is designed to help you experience the peace, hope, and growth that come from encountering the voice and presence of God in Scripture. Every feature in Abide is designed to teach and develop Scripture-engagement habits that help you know the power and spiritual nourishment of abiding in Christ.\nCreated in partnership with Bible Gateway and the Taylor University Center for Scripture Engagement, The Abide Bible’s features include book introductions and practical Scripture-engagement prompts based on five ways of interacting deeply with the Bible.\n(https://www.thomasnelsonbibles.com/AbideBible/)",
    moreInfoUrl: "https://www.thomasnelsonbibles.com/AbideBible/",
    sequence: 15,
  },
  {
    id: 17,
    title: "Scripture Engagement page at Bible Gateway",
    description:
      "In partnership with the Taylor University Center for Scripture Engagement, Bible Gateway has made available for free over 50 short practical articles on how you can interact more meaningfully with the Bible.  Introductory articles include topics about “What is Scripture Engagement?”, “Scripture Engagement Compared to Bible Study”, and “Scripture Engagement Bible Passages.”  Also included are thirteen specific Scripture engagement practices with descriptions, getting started ideas, and resources for further investigation.\n(https://www.biblegateway.com/resources/scripture-engagement/)",
    moreInfoUrl: "https://www.biblegateway.com/resources/scripture-engagement/",
    sequence: 16,
  },
];

const moreData = [
  {
    id: 16,
    surveyDimensionId: 26,
    abbreviation: "Christian",
    title: "The Abide Bible",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 88,
    practiceId: 16,
    sequence: 15,
    description:
      "The Abide Bible is designed to help you experience the peace, hope, and growth that come from encountering the voice and presence of God in Scripture. Every feature in Abide is designed to teach and develop Scripture-engagement habits that help you know the power and spiritual nourishment of abiding in Christ.\nCreated in partnership with Bible Gateway and the Taylor University Center for Scripture Engagement, The Abide Bible’s features include book introductions and practical Scripture-engagement prompts based on five ways of interacting deeply with the Bible.\n(https://www.thomasnelsonbibles.com/AbideBible/)",
    moreInfoUrl: "https://www.thomasnelsonbibles.com/AbideBible/",
  },
  {
    id: 17,
    surveyDimensionId: 26,
    abbreviation: "Christian",
    title: "Scripture Engagement page at Bible Gateway",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 88,
    practiceId: 17,
    sequence: 16,
    description:
      "In partnership with the Taylor University Center for Scripture Engagement, Bible Gateway has made available for free over 50 short practical articles on how you can interact more meaningfully with the Bible.  Introductory articles include topics about “What is Scripture Engagement?”, “Scripture Engagement Compared to Bible Study”, and “Scripture Engagement Bible Passages.”  Also included are thirteen specific Scripture engagement practices with descriptions, getting started ideas, and resources for further investigation.\n(https://www.biblegateway.com/resources/scripture-engagement/)",
    moreInfoUrl: "https://www.biblegateway.com/resources/scripture-engagement/",
  },
  {
    id: 2,
    surveyDimensionId: 27,
    abbreviation: "Centered on God",
    title: "Praying Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 73,
    practiceId: 2,
    sequence: 2,
    description:
      "Engaging the Bible and praying are the primary methods for developing a deepening relationship with God. While many tend to think of prayer and Bible reading as separate spiritual practices (e.g., first pray, then read the Bible), they can be even more powerful when combined into one practice of “praying Scripture.” Numerous ways to pray Scripture are explored in this method of Scripture engagement.\n(https://www.biblegateway.com/resources/scripture-engagement/praying-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/praying-scripture/home",
  },
  {
    id: 4,
    surveyDimensionId: 27,
    abbreviation: "Centered on God",
    title: "Journaling Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 73,
    practiceId: 4,
    sequence: 4,
    description:
      "A Scripture journal is a conversation with God. It is meant to be a place where you can safely record and reflect on your raw thoughts and feelings, ask questions, search for patterns, and develop your own thoughts with the Holy Spirit as your guide. Being candid with both God and yourself deeply enhances spiritual growth. Confession to God results in an open and honest relationship with him that allows the Spirit to continue to shape and mold you into Christ’s image. \n(https://www.biblegateway.com/resources/scripture-engagement/journaling-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/journaling-scripture/home",
  },
  {
    id: 9,
    surveyDimensionId: 27,
    abbreviation: "Centered on God",
    title: "Memorizing Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 73,
    practiceId: 9,
    sequence: 9,
    description:
      "Memorizing Scripture is one of the most effective means of Scripture engagement. Because Scripture engagement is about reflecting on the Bible and mulling a passage over in our minds, having a passage memorized makes the process of reflection available to you at all times. Memorized Scripture allows you to dwell continuously on a passage throughout the day. Suggestions for what to memorize and how are given in this section.\n(https://www.biblegateway.com/resources/scripture-engagement/scripture-memorization/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/scripture-memorization/home",
  },
  {
    id: 7,
    surveyDimensionId: 28,
    abbreviation: "Service",
    title: "Storying Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 79,
    practiceId: 7,
    sequence: 7,
    description:
      "In storying, a teacher tells a Bible story by memory to a group of people. The listeners then retell the story together back to the teacher as best as they can. The teacher than tells the story again until all of the listeners have the story in their memory. The group then discusses the story and relates their own lives to the story. The goal is for the listeners to learn the story so they can share it with others, in a sense becoming walking, talking Bibles. Storying is a particularly powerful means of engaging Scripture in a small group setting. Storying cultivates interaction among the group members as they come together to try to retell the story.\n(https://www.biblegateway.com/resources/scripture-engagement/storying-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/storying-scripture/home",
  },
  {
    id: 8,
    surveyDimensionId: 28,
    abbreviation: "Service",
    title: "Speaking Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 79,
    practiceId: 8,
    sequence: 8,
    description:
      "We are created for community and wired to speak with others. The things in our lives that are on our hearts naturally come out in our conversations, and those conversations result in our turning those ideas over in our minds (in other words, what we talk about often leads to what we think/meditate about). A consistent theme in the Bible is that God tells us to speak to others about what he has said to us—we aren’t to keep his Word to ourselves. Instead, his Word is to be on our lips, and we are to speak Scripture to one another. By speaking about Scripture with other people, you will deepen your connection with God’s Word. \n(https://www.biblegateway.com/resources/scripture-engagement/speaking-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/speaking-scripture/home",
  },
  {
    id: 13,
    surveyDimensionId: 28,
    abbreviation: "Service",
    title: "Public Reading of Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 79,
    practiceId: 13,
    sequence: 13,
    description:
      "The Bible was meant to be read, but it was also meant to be heard. To hear someone read Scripture is a different experience than to simply read silently to yourself. A well-prepared and gifted reader can bring out meaning in a text through voice inflection, rhythm, and intonation. A talented reader can present the Word of God to a group or congregation so that the listeners experience the Bible in a rich and powerful manner. Suggestions for reading the selected passage out loud (either by yourself or with other people) are given in this section.\n(https://www.biblegateway.com/resources/scripture-engagement/public-reading-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/public-reading-scripture/home",
  },
  {
    id: 4,
    surveyDimensionId: 27,
    abbreviation: "Centered on the Bible",
    title: "Journaling Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 4,
    sequence: 4,
    description:
      "A Scripture journal is a conversation with God. It is meant to be a place where you can safely record and reflect on your raw thoughts and feelings, ask questions, search for patterns, and develop your own thoughts with the Holy Spirit as your guide. Being candid with both God and yourself deeply enhances spiritual growth. Confession to God results in an open and honest relationship with him that allows the Spirit to continue to shape and mold you into Christ’s image. \n(https://www.biblegateway.com/resources/scripture-engagement/journaling-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/journaling-scripture/home",
  },
  {
    id: 8,
    surveyDimensionId: 27,
    abbreviation: "Centered on the Bible",
    title: "Speaking Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 8,
    sequence: 8,
    description:
      "We are created for community and wired to speak with others. The things in our lives that are on our hearts naturally come out in our conversations, and those conversations result in our turning those ideas over in our minds (in other words, what we talk about often leads to what we think/meditate about). A consistent theme in the Bible is that God tells us to speak to others about what he has said to us—we aren’t to keep his Word to ourselves. Instead, his Word is to be on our lips, and we are to speak Scripture to one another. By speaking about Scripture with other people, you will deepen your connection with God’s Word. \n(https://www.biblegateway.com/resources/scripture-engagement/speaking-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/speaking-scripture/home",
  },
  {
    id: 9,
    surveyDimensionId: 27,
    abbreviation: "Centered on the Bible",
    title: "Memorizing Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 9,
    sequence: 9,
    description:
      "Memorizing Scripture is one of the most effective means of Scripture engagement. Because Scripture engagement is about reflecting on the Bible and mulling a passage over in our minds, having a passage memorized makes the process of reflection available to you at all times. Memorized Scripture allows you to dwell continuously on a passage throughout the day. Suggestions for what to memorize and how are given in this section.\n(https://www.biblegateway.com/resources/scripture-engagement/scripture-memorization/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/scripture-memorization/home",
  },
  {
    id: 10,
    surveyDimensionId: 27,
    abbreviation: "Centered on the Bible",
    title: "Hand Copying Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 10,
    sequence: 10,
    description:
      "Hand copying Scripture is simply writing passages of Scripture by hand word-for-word. Writing the Bible by hand offers the unique opportunity to participate in an activity that forces you to slow down the process of reading and encourages a more reflective engagement with God’s Word. It gives more time to think about what you’re writing and to dwell on the meaning and implications of a passage. Hand copying is a focusing activity that combats quick, surface-level reading. Copying is also an aid to memory and helps you to perceive details in a passage that you might overlook otherwise.\n(https://www.biblegateway.com/resources/scripture-engagement/hand-copying-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/hand-copying-scripture/home",
  },
  {
    id: 13,
    surveyDimensionId: 27,
    abbreviation: "Centered on the Bible",
    title: "Public Reading of Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 75,
    practiceId: 13,
    sequence: 13,
    description:
      "The Bible was meant to be read, but it was also meant to be heard. To hear someone read Scripture is a different experience than to simply read silently to yourself. A well-prepared and gifted reader can bring out meaning in a text through voice inflection, rhythm, and intonation. A talented reader can present the Word of God to a group or congregation so that the listeners experience the Bible in a rich and powerful manner. Suggestions for reading the selected passage out loud (either by yourself or with other people) are given in this section.\n(https://www.biblegateway.com/resources/scripture-engagement/public-reading-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/public-reading-scripture/home",
  },
  {
    id: 1,
    surveyDimensionId: 28,
    abbreviation: "Connected",
    title: "Singing Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 1,
    sequence: 1,
    description:
      "Singing the truths in the Bible enhances your experience with God through his Word both emotionally and cognitively. Excellent music stirs our hearts, enhancing the feelings that are associated with the message of the lyrics. The lyrics of songs are poetry, and poetry, because of its extensive imagery, also helps us feel the truth of a message in a powerful way. Singing Scriptures can deepen your thinking about God by helping you meditate on God’s truth. In addition, the power of song to help you remember is irrefutable. \n(https://www.biblegateway.com/resources/scripture-engagement/singing-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/singing-scripture/home",
  },
  {
    id: 2,
    surveyDimensionId: 28,
    abbreviation: "Connected",
    title: "Praying Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 2,
    sequence: 2,
    description:
      "Engaging the Bible and praying are the primary methods for developing a deepening relationship with God. While many tend to think of prayer and Bible reading as separate spiritual practices (e.g., first pray, then read the Bible), they can be even more powerful when combined into one practice of “praying Scripture.” Numerous ways to pray Scripture are explored in this method of Scripture engagement.\n(https://www.biblegateway.com/resources/scripture-engagement/praying-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/praying-scripture/home",
  },
  {
    id: 6,
    surveyDimensionId: 28,
    abbreviation: "Connected",
    title: "Contemplate",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 6,
    sequence: 6,
    description:
      "Contemplating a passage of Scripture is a long-standing spiritual practice in the church, often called Lectio Divina (Latin for “sacred reading”). The four traditional stages of contemplation are reading, meditation, prayer, and contemplation. The steps were created simply to provide structure and guidance for people who wish to learn how to perform this practice. Contemplation is best practiced with passages that you have at least some familiarity with; it is not intended to introduce you to something new in the Bible. The purpose of contemplating Scripture is to allow you to experience it and reflect more deeply on what you know.\n(https://www.biblegateway.com/resources/scripture-engagement/lectio-divina/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/lectio-divina/home",
  },
  {
    id: 11,
    surveyDimensionId: 28,
    abbreviation: "Connected",
    title: "Manuscript Bible Study",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 76,
    practiceId: 11,
    sequence: 11,
    description:
      "The Manuscript Bible Study method is a small group Scripture engagement practice that has been around for over 60 years. People gather together to observe a passage where they see more details as a community than they would as individuals. Individuals first mark their manuscript (a printed version of a passage), looking for key words, promises, contrasts/comparisons, illustrations, repetition of ideas, structure of the passage, connections, etc. They also develop questions they have about the passage. The group then shares their observations and questions and works together to answer those questions from the Bible. The group then processes and applies the passage together.\n(https://www.biblegateway.com/resources/scripture-engagement/manuscript-bible-study/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/manuscript-bible-study/home",
  },
  {
    id: 2,
    surveyDimensionId: 28,
    abbreviation: "Reflective",
    title: "Praying Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 78,
    practiceId: 2,
    sequence: 2,
    description:
      "Engaging the Bible and praying are the primary methods for developing a deepening relationship with God. While many tend to think of prayer and Bible reading as separate spiritual practices (e.g., first pray, then read the Bible), they can be even more powerful when combined into one practice of “praying Scripture.” Numerous ways to pray Scripture are explored in this method of Scripture engagement.\n(https://www.biblegateway.com/resources/scripture-engagement/praying-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/praying-scripture/home",
  },
  {
    id: 3,
    surveyDimensionId: 28,
    abbreviation: "Reflective",
    title: "Picture It",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 78,
    practiceId: 3,
    sequence: 3,
    description:
      "The Picture It method of Scripture engagement (also sometimes called Imaginative Contemplation or the Ignatian Method) gives you the opportunity to engage your imagination. God has given us the biblical stories so we can connect with them on all levels, learning who he is and what he cares about. In this method, you place yourself in the stories of Scripture in an attempt to better empathize with the people of the Bible and “experience” their stories. With the Picture It method, you are no longer just reading a book—you are living a story. This is especially helpful for those who tend to connect to Scripture on a purely cognitive level, allowing them to experience more of the emotion of the text.\n(https://www.biblegateway.com/resources/scripture-engagement/ignatian-method/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/ignatian-method/home",
  },
  {
    id: 10,
    surveyDimensionId: 28,
    abbreviation: "Reflective",
    title: "Hand Copying Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 78,
    practiceId: 10,
    sequence: 10,
    description:
      "Hand copying Scripture is simply writing passages of Scripture by hand word-for-word. Writing the Bible by hand offers the unique opportunity to participate in an activity that forces you to slow down the process of reading and encourages a more reflective engagement with God’s Word. It gives more time to think about what you’re writing and to dwell on the meaning and implications of a passage. Hand copying is a focusing activity that combats quick, surface-level reading. Copying is also an aid to memory and helps you to perceive details in a passage that you might overlook otherwise.\n(https://www.biblegateway.com/resources/scripture-engagement/hand-copying-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/hand-copying-scripture/home",
  },
  {
    id: 5,
    surveyDimensionId: 27,
    abbreviation: "Centered on Others",
    title: "Engage Through Art",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 74,
    practiceId: 5,
    sequence: 5,
    description:
      "Images connect with our emotions and can convey deep truths; they can be powerful triggers to help remember the stories and connect with the truths of the Bible. A good piece of biblical art can give “fresh eyes” for familiar passages. The artist becomes your companion who points out details of a passage that you might have passed over in merely reading. Since art is often complicated and takes time to understand, it requires you to slow down and helps you meditate on a passage. In the presence of the Holy Spirit, you combine the resource of art and the inspired words of the Bible, allowing you to encounter the God of the Bible in a new way.\n(https://www.biblegateway.com/resources/scripture-engagement/art/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/art/home",
  },
  {
    id: 8,
    surveyDimensionId: 27,
    abbreviation: "Centered on Others",
    title: "Speaking Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 74,
    practiceId: 8,
    sequence: 8,
    description:
      "We are created for community and wired to speak with others. The things in our lives that are on our hearts naturally come out in our conversations, and those conversations result in our turning those ideas over in our minds (in other words, what we talk about often leads to what we think/meditate about). A consistent theme in the Bible is that God tells us to speak to others about what he has said to us—we aren’t to keep his Word to ourselves. Instead, his Word is to be on our lips, and we are to speak Scripture to one another. By speaking about Scripture with other people, you will deepen your connection with God’s Word. \n(https://www.biblegateway.com/resources/scripture-engagement/speaking-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/speaking-scripture/home",
  },
  {
    id: 13,
    surveyDimensionId: 27,
    abbreviation: "Centered on Others",
    title: "Public Reading of Scripture",
    useForPredictions: true,
    letterId: 10,
    surveyIndexId: 74,
    practiceId: 13,
    sequence: 13,
    description:
      "The Bible was meant to be read, but it was also meant to be heard. To hear someone read Scripture is a different experience than to simply read silently to yourself. A well-prepared and gifted reader can bring out meaning in a text through voice inflection, rhythm, and intonation. A talented reader can present the Word of God to a group or congregation so that the listeners experience the Bible in a rich and powerful manner. Suggestions for reading the selected passage out loud (either by yourself or with other people) are given in this section.\n(https://www.biblegateway.com/resources/scripture-engagement/public-reading-scripture/home)",
    moreInfoUrl:
      "https://www.biblegateway.com/resources/scripture-engagement/public-reading-scripture/home",
  },
];
