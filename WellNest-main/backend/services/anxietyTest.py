import streamlit as st
import requests

def calculate_score(responses):
    return sum(responses)
def get_suggestions(score):
    if 0 <= score <= 5:
        return "Mild anxiety: It's a good idea to monitor your feelings and maintain a healthy routine. If you'd like to discuss your concerns, our chatbot is here for you."
    elif 6 <= score <= 10:
        return "Moderate anxiety: Consider consulting with a mental health professional for further evaluation. Our chatbot can provide resources and support."
    elif 11 <= score <= 15:
        return "Moderately severe anxiety: It’s important to seek guidance from a mental health expert. Reach out to our chatbot for assistance in finding the right resources."
    elif score >= 16:
        return "Severe anxiety: Immediate consultation with a mental health professional is highly recommended. Please use our chatbot to guide you to the appropriate help."

query_params = st.query_params
email = query_params.get("email", [""])  

# Streamlit UI
st.title("Anxiety Test - WellNest")
st.write("Answer the questions below to assess the severity of your anxiety symptoms. This test is based on the GAD-7 scale.")

questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it’s hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen"
]

options = [
    "Not at all (0 points)", 
    "Several days (1 point)", 
    "More than half the days (2 points)", 
    "Nearly every day (3 points)"
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
                "https://wellnest-5zry.onrender.com/api/test/anxiety-score", 
                json={"email": email, "score": score}
            )
            if response.status_code == 200:
                st.success(f"Your anxiety score is : {score}")
            else:
                st.error(f"Failed to send score. Status code: {response.status_code}")
        except Exception as e:
            st.error(f"Error sending score: {e}")
    else:
        st.warning("No email found in URL query parameters. Score not sent to backend.")

    st.write("If you need help, our chatbot is here to assist you. Click the chatbot icon on the website to start a conversation!")