// utils/VoteTracker.js

let voteCount = 0;

export const incrementVoteCount = () => {
  voteCount++;
  return voteCount;
};

export const resetVoteCount = () => {
  voteCount = 0;
};

export const getVoteCount = () => voteCount;
