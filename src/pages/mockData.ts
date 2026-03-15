export const MOCK_DATA = {
  tasks: [
    {
      groupId: 1,
      groupName: '英语学习',
      students: [
        { studentId: '101', task: '练习餐厅点餐英语，掌握常用句型' },
        { studentId: '102', task: '练习酒店入住英语，能够顺利办理入住' },
      ],
    },
  ],
  scripts: {
    '101': [
      {
        order: 1,
        question: '你好，我想点餐',
        answer: '当然，这是菜单，您看看想吃点什么？',
      },
      {
        order: 2,
        question: '这个牛排套餐包含什么？',
        answer: '牛排套餐包含一份西冷牛排、薯条、沙拉和一杯软饮。',
      },
      {
        order: 3,
        question: '牛排要七分熟，再要一杯橙汁',
        answer: '好的，七分熟牛排，一杯橙汁。请问还需要其他吗？',
      },
    ],
    '102': [
      {
        order: 1,
        question: '我要办理入住',
        answer: '好的，请出示您的护照和预订信息。',
      },
      {
        order: 2,
        question: '这是我的护照，预订名字是张伟',
        answer: '找到了，您预订了一间大床房，住两晚，对吗？',
      },
    ],
  },
};
