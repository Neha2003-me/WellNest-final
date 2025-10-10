import streamlit as st
import requests

def calculate_score(responses):
    return sum(responses)

def get_suggestions(score):
    if 0 <= score <= 7:
        return "You might have subclinical OCD. No significant symptoms were observed. Maintain a balanced lifestyle, and if you have concerns, our chatbot can assist."
    elif 8 <= score <= 15:
        return "You might have mild OCD. Engage in self-care activities and monitor your symptoms. If you'd like guidance, our chatbot is here to help."
    elif 16 <= score <= 23:
        return "You might have moderate OCD. Consider speaking with a mental health professional for further evaluation. Our chatbot can provide resources and support."
    elif 24 <= score <= 31:
        return "You might have severe OCD. It's recommended to consult a mental health specialist soon. Reach out to our chatbot for assistance in finding resources."
    elif 32 <= score <= 40:
        return "You might have extreme OCD. Immediate consultation with a mental health professional is crucial. Please let our chatbot guide you to the right support."

query_params = st.query_params
email = query_params.get("email", [""])

st.title("OCD Test - WellNest")
st.write("Answer the questions below to assess the severity of your OCD symptoms. This test is based on the Yale-Brown Obsessive Compulsive Scale (Y-BOCS).")

questions = [
    "How much of your time is occupied by obsessive thoughts?",
    "How much do your obsessive thoughts interfere with functioning in your social, work, or other roles?",
    "How much distress do your obsessive thoughts cause you?",
    "How much of an effort do you make to resist the obsessive thoughts?",
    "How much control do you have over your obsessive thoughts?",
    "How much time do you spend performing compulsive behaviors?",
    "How much do your compulsive behaviors interfere with functioning in your social, work, or other roles?",
    "How anxious would you become if you were prevented from performing your compulsive behaviors?",
    "How much of an effort do you make to resist the compulsions?",
    "How much control do you have over the compulsions?"
]

options = [
    "None (0 points)", 
    "Mild (1 point)", 
    "Moderate (2 points)", 
    "Severe (3 points)", 
    "Extreme (4 points)"
]

responses = []
for question in questions:
    response = st.selectbox(question, options, key=question)
    responses.append(options.index(response))

if st.button("Submit"):
    score = calculate_score(responses)
    st.write(get_suggestions(score))

    if email:
        try:
            response = requests.post(
                "https://wellnest-5zry.onrender.com/api/test/ocd-score",
                json={"email": email, "score": score}
            )
            if response.status_code == 200:
                st.success(f"Your OCD score is : {score}")
            else:
                st.error(f"Failed to send score. Status code: {response.status_code}")
        except Exception as e:
            st.error(f"Error sending score: {e}")
    else:
        st.warning("No email found in URL query parameters. Score not sent to backend.")

    st.write("If you need help, our chatbot is here to assist you. Click the chatbot icon on the website to start a conversation!")
