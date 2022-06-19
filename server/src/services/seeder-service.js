'use strict';

const env = require('env-var');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../utils/logger');

const User = require('../models/user-model');
const Role = require('../models/role-model');
const Topic = require('../models/topic-model');
const Video = require('../models/video-model');
const VideoTopic = require('../models/videoTopic-model');
const UserVideo = require('../models/userVideo-model');
const UrlDocument = require('../models/urlDocument-model');

const { ROLE } = require('../utils/constants');
const { BadRequestError } = require('../utils/errors');

const ADMIN_ROLE = new Role({
  name: ROLE.admin,
});
const USER_ROLE = new Role({
  name: ROLE.user,
});

const DUMMY_TOPICS = [
  new Topic({
    name: 'Math',
    color: '#6a76e2',
    thumbnail: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Pure-mathematics-formul%C3%A6-blackboard.jpg',
      height: 640,
      width: 480,
    },
  }),
  new Topic({
    name: 'JavaScript',
    color: '#ff0',
    thumbnail: {
      url: 'https://images.velog.io/images/azurestefan/post/6ea262c6-5cc0-4c53-b3d9-9181f13e5c45/JavaScript.png',
      height: 640,
      width: 480,
    },
  }),
  new Topic({
    name: 'Python',
    color: '#4671a2',
    thumbnail: {
      url: 'https://media.geeksforgeeks.org/wp-content/uploads/20190717171924/thumb1.png',
      height: 640,
      width: 480,
    },
  }),
];

const DUMMY_USER = [
  // adminPassword
  new User({
    username: 'AdminUser',
    encrypt_password:
      '2dc1e70234e738211cfb984338a4b56aece53f8e1cc4585419e69b545c9c6b1ab7859399fde1e81c9ff34d1dba5c461fedaa573a734e054650c8ed49bd5e66ef',
    isDeleted: false,
    roleId: ADMIN_ROLE,
    salt: 'ba1c23c5-875f-4d80-ac92-fcb90e6b7150',
    email: 'DUMMYadmin@gmail.com',
  }),
  new User({
    // userPassword
    username: 'SimpleUser',
    encrypt_password:
      'd8f5dbfbddf057119587f8f8b38875c030e2e49df1749e4b40e62dcf87c177e2263d31f6612acb60712cd2675f014edad0be075211639bcd24d581795a059f26',
    isDeleted: false,
    roleId: USER_ROLE,
    salt: '02ba3ee1-52c0-4993-845c-606f7c4de92e',
    email: 'DUMMYuser@gmail.com',
  }),
];

const DUMMY_VIDEO = [
  new Video({
    title: 'Limits',
    originalTitle: 'Limits',
    originURL: '&https://www.youtube.com/watch?v=tSzMZqrAqPc&t=6s&ab_channel=Isibalo',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/ZX3qt0UWifc/sddefault.jpg',
      height: 640,
      width: 480,
    },
    description: 'Limits Description',
    channelTitle: 'channel Title',
    duration: 'PT23M21S',
    defaultLanguage: 'en-US',
    userId: DUMMY_USER[0],
    dataType: 'Podcast',
  }),
  new Video({
    title: 'Continuing Limits',
    originalTitle: 'Continuing Limits',
    originURL: 'https://www.youtube.com/watch?v=0B0rUKCGNU8&ab_channel=Isibalo',
    thumbnail: {
      url: 'https://i.ytimg.com/vi/ZX3qt0UWifc/sddefault.jpg',
      height: 640,
      width: 480,
    },
    description: 'Continuing Limits Description',
    channelTitle: 'channel Title',
    duration: 'PT23M21S',
    defaultLanguage: 'en-US',
    userId: DUMMY_USER[1],
    dataType: 'Video',
  }),
];

const DUMMY_URL_DOCUMENTS = [
  new UrlDocument({
    name: 'Very important Document',
    urlLink: 'https://stackoverflow.com/questions/27465851/how-should-i-handle-very-very-long-url',
    videoId: DUMMY_VIDEO[0],
  }),
  new UrlDocument({
    name: 'Not very important Document',
    urlLink: 'https://www.lipsum.com/',
    videoId: DUMMY_VIDEO[1],
  }),
];

const DUMMY_USER_VIDEO = [
  new UserVideo({
    userId: DUMMY_USER[0],
    videoId: DUMMY_VIDEO[0],
    favorite: true,
  }),
  new UserVideo({
    userId: DUMMY_USER[1],
    videoId: DUMMY_VIDEO[1],
    favorite: true,
  }),
  new UserVideo({
    userId: DUMMY_USER[0],
    videoId: DUMMY_VIDEO[2],
    favorite: true,
  }),
];

const DUMMY_VIDEO_TOPICS = [
  new VideoTopic({
    videoId: DUMMY_VIDEO[0],
    topicId: DUMMY_TOPICS[0],
  }),
  new VideoTopic({
    videoId: DUMMY_VIDEO[1],
    topicId: DUMMY_TOPICS[1],
  }),
  new VideoTopic({
    videoId: DUMMY_VIDEO[2],
    topicId: DUMMY_TOPICS[2],
  }),
];

const createDummyData = async () => {
  const mongoUri = env.get('MONGO_URI').required().asUrlString();
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();

    logger.info('Connected correctly to the Database.');

    // Create Collections
    const userCollection = client.db('video_library').collection('user');
    const roleCollection = client.db('video_library').collection('role');
    const videoCollection = client.db('video_library').collection('video');
    const topicCollection = client.db('video_library').collection('topic');
    const videoTopicCollection = client.db('video_library').collection('videoTopic');
    const userVideoCollection = client.db('video_library').collection('userVideo');
    const urlDocumentCollection = client.db('video_library').collection('urlDocument');

    const collections = await client.db('video_library').collections();

    // Drop Collections if exists
    if (collections.length !== 0) {
      try {
        userCollection.drop();
        roleCollection.drop();
        videoCollection.drop();
        topicCollection.drop();
        videoTopicCollection.drop();
        userVideoCollection.drop();
        urlDocumentCollection.drop();
      } catch (error) {
        logger.error(`Database dropping had problems: ${error}`);
        throw new BadRequestError('Database dropping had problems');
      }
    }

    // Seed DB
    roleCollection.insertOne(ADMIN_ROLE);
    roleCollection.insertOne(USER_ROLE);
    topicCollection.insertMany(DUMMY_TOPICS);
    userCollection.insertMany(DUMMY_USER);
    urlDocumentCollection.insertMany(DUMMY_URL_DOCUMENTS);
    videoCollection.insertMany(DUMMY_VIDEO);
    userVideoCollection.insertMany(DUMMY_USER_VIDEO);
    videoTopicCollection.insertMany(DUMMY_VIDEO_TOPICS);

    logger.info('Database has been seeded successfully.');
  } catch (err) {
    logger.error(`Database seeding has been unsuccessful: ${err}`);
    throw new BadRequestError('Database seeding has been unsuccessful');
  }
};

module.exports = createDummyData;
