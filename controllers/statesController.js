const State = require('../model/State');
const stateFactsArray = State.find()
const statesJSON = require('../model/states.json');

/* mergedStates = [];
    statesJSON.forEach(state => {
        const stateDB = State.findOne({ code: req.code }).exec();
        if (!stateDB) {
            mergedStates.push(state);
        }
        else {
            mergedStates.push(state, stateDB.funfacts);
        }
    }); */

const getAllStates = async (req, res) => {
    const contigList = statesJSON.filter(st => st.code !== 'AK' && st.code !== 'HI');
    const noncontList  = statesJSON.filter(st => st.code === 'AK' || st.code === 'HI');
    if (req.query?.contig) {
        contig = req.query.contig;
        if (contig === 'false') { 
            return res.json(noncontList);
        } else {
            return res.json(contigList);
        }
    } else {
        const statesDB = await State.find();
        const mergedStates = [];
        statesJSON.forEach(state => {
            statesDB.forEach(st => {
                if (st.code === state.code) {
                    state.funfacts = st.funfacts;
                }
            })
            mergedStates.push(state);
        })
        return res.json(mergedStates);
    }
    //if (!states) return res.status(204).json({ 'message': 'No states found' });
}

const getFunFacts = async (req, res) => {
    const stateDB = await State.findOne({ code: req.code }).exec();
    if (!stateDB) {
        const state = statesJSON.find(st => st.code === req.code)
        return res.status(404).json({ 'message': `No Fun Facts found for ${state.state}` });
    }
    const funfact = stateDB.funfacts[Math.floor(Math.random() * stateDB.funfacts.length)];
    return res.json({funfact});
}

const createFunFact = async (req, res) => {
    if (!req?.body?.funfacts) return res.status(400).json({ 'message': 'State fun facts value required' });
    if (!Array.isArray(req.body.funfacts)) return res.json({ 'message': 'State fun facts value must be an array' });
    const stateDB = await State.findOne({ code: req.code }).exec();
    try {
        await State.updateOne(
            { code: req.code },
            { $push: { funfacts: req.body.funfacts } },
            { upsert: true }
        );
        const newState = await State.findOne({ code: req.code }).exec();
        return res.status(201).json(newState);
    } catch (err) {
        console.error(err);
    }
}

const patchFunFact = async (req, res) => {
    if (!req?.body?.index) return res.status(400).json({ 'message': 'State fun fact index value required' });
    if (!req?.body?.funfact) return res.status(400).json({ 'message': 'State fun fact value required' });
    const pos = req.body.index-1;
    const stateDB = await State.findOne({ code: req.code }).exec();
    if (!stateDB) {
        const state = statesJSON.find(st => st.code === req.code)
        return res.status(404).json({ 'message': `No Fun Facts found for ${state.state}` });
    }
    if (!stateDB.funfacts[pos]) {
        const state = statesJSON.find(st => st.code === req.code);
        return res.status(400).json({ 'message': `No Fun Fact found at that index for ${state.state}` });
    }
    stateDB.funfacts[pos] = req.body.funfact;
    await stateDB.save();
    const newState = await State.findOne({ code: req.code }).exec();
    return res.json(newState);
}

const deleteFunFact = async (req, res) => {
    if (!req.body?.index) { return res.status(400).json({ 'message': 'State fun fact index value required' })};
    const pos = req.body.index-1;
    const stateDB = await State.findOne({ code: req.code }).exec();
    if (!stateDB) {
        const state = statesJSON.find(st => st.code === req.code);
        return res.status(400).json({ "message": `No Fun Facts found for ${state.state}` });
    }
    if (!stateDB.funfacts[pos]) {
        const state = statesJSON.find(st => st.code === req.code);
        return res.status(400).json({ 'message': `No Fun Fact found at that index for ${state.state}` });
    }
    const funfacts = stateDB.funfacts.filter(ff => ff !== stateDB.funfacts[pos]);
    stateDB.deleteOne({ code: req.code });
    await State.updateOne(
        { code: req.code },
        { $push: { funfacts: funfacts } },
        { upsert: true }
    );
    return res.json(stateDB);
    //const newStateDB = stateDB.
}

const getState = async (req, res) => {
    const state = statesJSON.find(st => st.code === req.code);
    return res.json(state);
}

const getStateAdmission = async (req, res) => {
    const state = statesJSON.find(st => st.code === req.code);
    return res.json({'state': state.state, 'admitted': state.admission_date});
}

const getStateCapital = async (req, res) => {
    const state = statesJSON.find(st => st.code === req.code);
    return res.json({'state': state.state, 'capital': state.capital_city});
}

const getStateNickname = async (req, res) => {
    const state = statesJSON.find(st => st.code === req.code);
    return res.json({'state': state.state, 'nickname': state.nickname});
}

const getStatePopulation = async (req, res) => {
    const state = statesJSON.find(st => st.code === req.code);
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    population = numberWithCommas(state.population);
    return res.json({'state': state.state, 'population': population});
}

module.exports = {
    getAllStates,
    getFunFacts,
    createFunFact,
    patchFunFact,
    deleteFunFact,
    getState,
    getStateAdmission,
    getStateCapital,
    getStateNickname,
    getStatePopulation
}