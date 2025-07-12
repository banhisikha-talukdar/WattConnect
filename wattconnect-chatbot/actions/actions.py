from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

class ActionProvideStaticTips(Action):

    def name(self) -> Text:
        return "action_provide_static_tips"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        bill = tracker.get_slot("bill")
        ac_hours = tracker.get_slot("ac_hours")
        heater = tracker.get_slot("heater")
        people = tracker.get_slot("people")

        tips = []

        if bill and bill > 2000:
            tips.append("💡 Reduce AC usage by 1-2 hours daily. Saves ₹300–₹500/month.")
            tips.append("💡 Switch to energy-efficient appliances if possible.")
            tips.append("💡 Turn off devices completely instead of standby mode.")

        if heater == "yes":
            tips.append("💡 Use water heater only when needed. Saves ₹200–₹400/month.")

        if ac_hours and ac_hours > 6:
            tips.append("💡 AC usage above 6 hours is costly. Try ceiling fans + ventilation.")

        if people and people > 4:
            tips.append("💡 More people = higher usage. Share common appliances efficiently.")

        if not tips:
            tips = ["✅ Your energy usage looks balanced. Keep it up!"]

        dispatcher.utter_message(text="\n".join(tips))
        return []