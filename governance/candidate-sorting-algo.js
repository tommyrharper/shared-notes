// The 1 sweep O(n) algorithm:
const sortCandidates = (candidates, voteeName, newNumOfVotes) => {
  let newCandidates = [];
  let hasSwapped = false;
  let hasReachedVotee = false;

  for (let i = 0; i < candidates.length; i++) {
    let candidate = candidates[i];

    // keep it in place
    if (candidate.votes > newNumOfVotes) newCandidates[i] = candidate;
    // keep it in place
    else if (candidate.votes == newNumOfVotes) newCandidates[i] = candidate;
    // either swap, get previous one, or keep it in place depending on stage in sweep
    else if (candidate.votes < newNumOfVotes) {
      // swap it
      if (!hasSwapped) {
        newCandidates[i] = { name: voteeName, votes: newNumOfVotes };
        hasSwapped = true;
      } else {
        // get previous one
        if (!hasReachedVotee) newCandidates[i] = candidates[i - 1];
        // keep it in place
        else newCandidates[i] = candidate;
      }
    }

    if (candidate.name == voteeName) hasReachedVotee = true;
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

const testSortCandidates = (candidates, voteeName, newNumOfVotes) => {
  let sortedCandidates = sortCandidates(candidates, voteeName, newNumOfVotes);

  console.log("result: ", sortedCandidates);

  for (let i = 0; i < sortedCandidates.length - 1; i++) {
    let candidate = sortedCandidates[i];
    let nextCandidate = sortedCandidates[i + 1];

    if (nextCandidate.votes > candidate.votes) {
      console.log(voteeName + newNumOfVotes, "failed ❌");
    }
  }

  console.log(voteeName + newNumOfVotes, "passed ✅");
};

testSortCandidates(candidates, "d", 8);
testSortCandidates(candidates, "d", 4);
testSortCandidates(candidates, "c", 10);
testSortCandidates(candidates, "c", 8);
testSortCandidates(candidates, "c", 7);
testSortCandidates(candidates, "a", 10);
testSortCandidates(candidates, "e", 10);
