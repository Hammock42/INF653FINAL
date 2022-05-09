const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyState = require('../../middleware/verifyState');

router.route('/')
    .get(statesController.getAllStates)

router.route('/:state/funfact')
    .get(verifyState(), statesController.getFunFacts)
    .post(verifyState(), statesController.createFunFact)
    .patch(verifyState(), statesController.patchFunFact)
    .delete(verifyState(), statesController.deleteFunFact)

router.route('/:state')
    .get(verifyState(), statesController.getState);

router.route('/:state/capital')
    .get(verifyState(), statesController.getStateCapital);

router.route('/:state/nickname')
    .get(verifyState(), statesController.getStateNickname);

router.route('/:state/population')
    .get(verifyState(), statesController.getStatePopulation);

router.route('/:state/admission')
    .get(verifyState(), statesController.getStateAdmission);

module.exports = router;