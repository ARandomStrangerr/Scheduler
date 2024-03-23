const map = new Map(); // map to store subscription

// subscription design pattern
export default {
	// call this function to subscribe
	subscribe (subscriptionName, functionToCall) {
		if (map.has(subscriptionName)) {
			map.get(subscriptionName).push(functionToCall);
		} else {
			let functionCallList = [];
			functionCallList.push(functionToCall);
			map.set(subscriptionName, functionCallList);
		}
	},
	// call this function to notify subscribed functions
	notify (subscriptionName){
		if (!map.has(subscriptionName)) throw new Error("subscription " + subscriptionName + " DNE");
		for (let functionToCall of map.get(subscriptionName)) {
			setTimeout(() => functionToCall(arguments), 0);
		}
	}
}
