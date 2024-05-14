const subscriptionMap = new Map(); // map to store subscription
const nextIdentifierMap = new Map(); // map for key
// call this function to subscribe
function subscribe (subscriptionName, functionToCall) {
	let id;
	if (subscriptionMap.has(subscriptionName)) {
		id = nextIdentifierMap.get(subscriptionName);
		subscriptionMap.get(subscriptionName).set(id, functionToCall);
		nextIdentifierMap.set(subscriptionName, id+1);
	} else {
		let functionCallMap = new Map();
		id = 0;
		functionCallMap.set(0, functionToCall);
		subscriptionMap.set(subscriptionName, functionCallMap);
		nextIdentifierMap.set(subscriptionName, 1);
	}
	return id;
}
function unsubscribe(subscriptionName, identifier){
	if (!subscriptionMap.has(subscriptionName)) throw new Error(`can't unsubscribe due to subscription under name ${subscriptionName} DNE`);
	subscriptionMap.get(subscriptionName).delete(identifier);
}
// call this function to notify subscribed functions
function notify (subscriptionName){
	if (!subscriptionMap.has(subscriptionName)) throw new Error(`subsription under name ${subscriptionName} DNE`);
	for (let functionToCall of subscriptionMap.get(subscriptionName)) {
		functionToCall[1](arguments);
	}
}
// subscription design pattern
export default {
	subscribe,
	unsubscribe,
	notify
}
