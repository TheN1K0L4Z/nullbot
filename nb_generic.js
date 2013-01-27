
/*
 * This file defines a standard AI personality for the base game. 
 * 
 * It relies on ruleset definition in /rulesets/ to provide
 * standard strategy descriptions and necessary game stat information.
 * 
 * Then it passes control to the main code.
 * 
 */

// You can redefine these paths when you make a customized AI
// for a map or a challenge.
NB_PATH = "/multiplay/skirmish/";
NB_INCLUDES = NB_PATH + "nb_includes/";
NB_RULESETS = NB_PATH + "nb_rulesets/";

// please don't touch this line
include(NB_INCLUDES + "_head.js.inc");

////////////////////////////////////////////////////////////////////////////////////////////
// Start the actual personality definition

// the rules in which this personality plays
include(NB_RULESETS + "standard.js.inc");

// variables defining the personality
var subpersonalities = {
	MR: {
		chatalias: "mr",
		weaponPaths: [ // weapons to use; put late-game paths below!
			weaponStats.rockets_AT, 
			weaponStats.machineguns, 
			weaponStats.rockets_AS, 
			weaponStats.rockets_AA, 
			weaponStats.rockets_late_AP,
		],
		earlyResearch: [ // fixed research path for the early game
			"R-Wpn-MG-Damage01",
			"R-Defense-Tower01",
			"R-Vehicle-Prop-Halftracks",
			"R-Struc-PowerModuleMk1",
			"R-Wpn-MG-Damage03",
		],
		minTanks: 3, // minimal attack force at game start
		becomeHarder: 3, // how much to increase attack force every 5 minutes
		maxTanks: 21, // maximum for the minTanks value (since it grows at becomeHarder rate)
		minTrucks: 5, // minimal number of trucks around
		minHoverTrucks: 4, // minimal number of hover trucks around
		minMiscTanks: 1, // number of tanks to start harassing enemy
		maxMiscTanks: 10, // number of tanks used for defense and harass
		maxPower: 300, // build expensive things if we have more than that
		repairAt: 50, // how much % healthy should droid be to join the attack group instead of repairing
		defensiveness: 70, // the chance % of not making droids when adaptation mechanism chooses defenses
	},
	MC: {
		chatalias: "mc",
		weaponPaths: [
			weaponStats.cannons, 
			weaponStats.machineguns, 
			weaponStats.mortars,
			weaponStats.cannons_AA,
		],
		earlyResearch: [
			"R-Wpn-MG-Damage01",
			"R-Vehicle-Prop-Halftracks",
			"R-Wpn-Cannon1Mk1",
			"R-Struc-PowerModuleMk1",
			"R-Wpn-MG-Damage03",
		],
		minTanks: 3, becomeHarder: 3, maxTanks: 21,
		minTrucks: 5, minHoverTrucks: 4,
		minMiscTanks: 1, maxMiscTanks: 10,
		maxPower: 300,
		repairAt: 50,
		defensiveness: 70,
	},
	FR: {
		chatalias: "fr",
		weaponPaths: [
			weaponStats.rockets_AT, 
			weaponStats.flamers,
			weaponStats.fireMortars,
			weaponStats.rockets_AA,
			weaponStats.rockets_late_AP,
		],
		earlyResearch: [
			"R-Wpn-Flamer-ROF01",
			"R-Vehicle-Prop-Halftracks",
			"R-Struc-PowerModuleMk1",
		],
		minTanks: 3, becomeHarder: 3, maxTanks: 21,
		minTrucks: 5, minHoverTrucks: 4,
		minMiscTanks: 1, maxMiscTanks: 10,
		maxPower: 300,
		repairAt: 50,
		defensiveness: 70,
	},
	FC: {
		chatalias: "fc",
		weaponPaths: [
			weaponStats.cannons, 
			weaponStats.flamers, 
			weaponStats.fireMortars,
			weaponStats.cannons_AA,
			weaponStats.lasers,
		],
		earlyResearch: [
			"R-Wpn-Flamer-ROF01",
			"R-Vehicle-Prop-Halftracks",
			"R-Wpn-Cannon1Mk1",
			"R-Struc-PowerModuleMk1",
		],
		minTanks: 3, becomeHarder: 3, maxTanks: 21,
		minTrucks: 5, minHoverTrucks: 4,
		minMiscTanks: 1, maxMiscTanks: 10,
		maxPower: 300,
		repairAt: 50,
		defensiveness: 70,
	},
};

// this function describes the early build order
function buildOrder() {
	var derrickCount = countFinishedStructList(structures.derricks);
	// might be good for Insane AI, or for rebuilding
	if (derrickCount > 0) 
		if (buildMinimum(structures.gens, 1)) return true;
	// lab, factory, gen, cc - the current trivial build order for the 3.2+ starting conditions
	if (buildMinimum(structures.factories, 1)) return true;
	if (buildMinimum(structures.labs, 1)) return true;
	if (buildMinimum(structures.gens, 1)) return true;
	// make sure trucks go capture some oil at this moment
	if (buildMinimumDerricks(1)) return true;
	if (buildMinimum(structures.hqs, 1)) return true;
	// what if one of them is being upgraded? will need the other anyway.
	// also, it looks like the right timing in most cases.
	if (buildMinimum(structures.gens, 2)) return true; 
	// make sure we have at least that much oils by now
	if (buildMinimumDerricks(5)) return true;
	// support hover maps
	var ret = scopeRatings(); 
	if (ret.land === 0 && !iHaveHover())
		if (buildMinimum(structures.labs, 4)) return true;
	if (ret.land === 0 && ret.sea === 0 && !iHaveVtol())
		if (buildMinimum(structures.labs, 4)) return true;
	// build more factories and labs when we have enough income
	if (buildMinimum(structures.labs, derrickCount / 3)) return true;
	if (buildMinimum(structures.factories, 2)) return true;
	if (buildMinimum(structures.templateFactories, 1)) return true;
	if (buildMinimum(structures.vtolFactories, 1)) return true;
	return false;
}

////////////////////////////////////////////////////////////////////////////////////////////
// Proceed with the main code

include(NB_INCLUDES + "_main.js.inc");
