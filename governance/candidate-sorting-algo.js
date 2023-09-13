// The 1 sweep O(n) algorithm:
const sortCandidates = (candidates, voteeName, newNumOfVotes) => {
  let newCandidates = [];
  let hasSwapped = false;
  let hasReachedVotee = false;

  for (let i = 0; i < candidates.length; i++) {
    let candidate = candidates[i];

    if (candidate.votes > newNumOfVotes) {
      // keep it in place
      newCandidates[i] = candidate;
    } else if (candidate.votes == newNumOfVotes) {
      // keep it in place
      newCandidates[i] = candidate;
    } else if (candidate.votes < newNumOfVotes) {
      if (!hasSwapped) {
        // swap it
        newCandidates[i] = { name: voteeName, votes: newNumOfVotes };
        hasSwapped = true;
      } else {
        if (!hasReachedVotee) {
					// get previous one
          newCandidates[i] = candidates[i - 1];
        } else {
					// keep it in place
          newCandidates[i] = candidate;
        }
      }
    }

    if (candidate.name == voteeName) {
      hasReachedVotee = true;
    }
  }

  return newCandidates;
};

// Tests:
let candidates = [
  {
    name: "a",
    votes: 9,
  },
  {
    name: "b",
    votes: 7,
  },
  {
    name: "c",
    votes: 5,
  },
  {
    name: "d",
    votes: 3,
  },
  {
    name: "e",
    votes: 1,
  },
];

let voteeName = "d";
let newNumOfVotes = 8;

let result = sortCandidates(candidates, voteeName, newNumOfVotes);
console.log(result);

candidates = [
  {
    name: "a",
    votes: 9,
  },
  {
    name: "b",
    votes: 7,
  },
  {
    name: "c",
    votes: 5,
  },
  {
    name: "d",
    votes: 3,
  },
  {
    name: "e",
    votes: 1,
  },
];

voteeName = "d";
newNumOfVotes = 4;

result = sortCandidates(candidates, voteeName, newNumOfVotes);
console.log(result);

candidates = [
  {
    name: "a",
    votes: 9,
  },
  {
    name: "b",
    votes: 7,
  },
  {
    name: "c",
    votes: 5,
  },
  {
    name: "d",
    votes: 3,
  },
  {
    name: "e",
    votes: 1,
  },
];

voteeName = "c";
newNumOfVotes = 10;

result = sortCandidates(candidates, voteeName, newNumOfVotes);
console.log(result);

candidates = [
  {
    name: "a",
    votes: 9,
  },
  {
    name: "b",
    votes: 7,
  },
  {
    name: "c",
    votes: 5,
  },
  {
    name: "d",
    votes: 3,
  },
  {
    name: "e",
    votes: 1,
  },
];

voteeName = "c";
newNumOfVotes = 8;

result = sortCandidates(candidates, voteeName, newNumOfVotes);
console.log(result);

candidates = [
  {
    name: "a",
    votes: 9,
  },
  {
    name: "b",
    votes: 7,
  },
  {
    name: "c",
    votes: 5,
  },
  {
    name: "d",
    votes: 3,
  },
  {
    name: "e",
    votes: 1,
  },
];

voteeName = "c";
newNumOfVotes = 7;

result = sortCandidates(candidates, voteeName, newNumOfVotes);
console.log(result);

candidates = [
  {
    name: "a",
    votes: 9,
  },
  {
    name: "b",
    votes: 7,
  },
  {
    name: "c",
    votes: 5,
  },
  {
    name: "d",
    votes: 3,
  },
  {
    name: "e",
    votes: 1,
  },
];

voteeName = "a";
newNumOfVotes = 10;

result = sortCandidates(candidates, voteeName, newNumOfVotes);
console.log(result);

candidates = [
  {
    name: "a",
    votes: 9,
  },
  {
    name: "b",
    votes: 7,
  },
  {
    name: "c",
    votes: 5,
  },
  {
    name: "d",
    votes: 3,
  },
  {
    name: "e",
    votes: 1,
  },
];

voteeName = "e";
newNumOfVotes = 10;

result = sortCandidates(candidates, voteeName, newNumOfVotes);
console.log(result);