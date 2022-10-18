const express = require("express");
const cache = require( '../utils/cache');
const { sendSuccess, sendError } = require( '../utils/utils');
const Problem = require ('../index');

const router = express.Router();

const ladderLimit = 100;
const fetchLadderLimit = 120;

const isEligibleForCache = (startRating, endRating) => {
	const start = parseInt(startRating, 10);
	const end = parseInt(endRating, 10);
	if (start % 100 == 0 && end % 100 == 0 && end - start === 100) {
		return true;
	}
	return false;
}

router.get('/ladder', (req, res) => {
	const { startRating, endRating } = req.query;
	
	if (!startRating || !endRating) {
		return sendError(res, 'Missing startRating or endRating', 'Missing startRating or endRating', 400);
	}

	if (isNaN(parseInt(startRating, 10)) || isNaN(parseInt(endRating, 10))) {
		return sendError(res, 'Invalid startRating or endRating', 'Invalid startRating or endRating', 400);
	}

	const useCache = isEligibleForCache(startRating, endRating);

	if (useCache) {
		const result = cache.get(`ladder:${startRating}:${endRating}`);
		if (result) {
			return sendSuccess(res, 'Ladder fetched', result);
		}
	}
	
	Problem.find({
		rating: {
			$gte: startRating,
			$lt: endRating,
		},
	})
	.sort({ frequency: -1 })
	.limit(fetchLadderLimit)
	.exec((err, result) => {
		const problems = result;
		if (err) {
			sendError(res, 'Internal Server Error', 'Error while fetching problems');
			return;
		}
		
		const uniqueProblems = new Set();
		const finalRes = [];
		const deltaContestIds = [1, 0, -1];

		for (const problem of problems) {
			const { contestId, name } = problem;
			const cid = parseInt(contestId, 10);
			let present = false;

			for (const deltaContestId of deltaContestIds) {
				if (uniqueProblems.has(`${cid + deltaContestId}:${name}`)) {
					present = true;
					break;
				}
			}
			uniqueProblems.add(`${cid}:${name}`);
			if (present) {
				continue;
			}
			finalRes.push(problem);
			if (finalRes.length === ladderLimit) {
				break;
			}
		}
		sendSuccess(res, 'Ladder fetched', finalRes);
		if (useCache) {
			cache.set(`ladder:${startRating}:${endRating}`, finalRes);
		}
	});
});

module.exports = router;
