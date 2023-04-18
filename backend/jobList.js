let jobList = [
  [
    'mafia',
    'citizen',
    'citizen',
    'citizen',
    'citizen',
    'mafia',
    'citizen',
    'citizen',
  ],
  [
    'citizen',
    'mafia',
    'citizen',
    'citizen',
    'citizen',
    'mafia',
    'citizen',
    'citizen',
  ],
  [
    'citizen',
    'citizen',
    'mafia',
    'citizen',
    'citizen',
    'mafia',
    'citizen',
    'citizen',
  ],
  [
    'citizen',
    'citizen',
    'citizen',
    'mafia',
    'citizen',
    'mafia',
    'citizen',
    'citizen',
  ],
];

module.exports = function getJobList() {
  let idx = ~~(Math.random() * (jobList.length - 0.01));
  return jobList[idx];
};
