import streamlit as st # type: ignore
import requests

class WellnessCalculator:
    def __init__(self, exercise_hours, exercise_intensity, water_intake,
                 fruit_veg_intake, sleep_hours, stress_level, work_life_balance):
        self.exercise_hours = exercise_hours
        self.exercise_intensity = exercise_intensity
        self.water_intake = water_intake
        self.fruit_veg_intake = fruit_veg_intake
        self.sleep_hours = sleep_hours
        self.stress_level = stress_level
        self.work_life_balance = work_life_balance

    def calculate_exercise_score(self):
        weekly_exercise_minutes = self.exercise_hours * 60
        score = min(weekly_exercise_minutes / 150, 1) * 10
        return round(score, 2)

    def calculate_nutrition_score(self):
        ideal_water_intake = 2.0
        ideal_fruit_veg_intake = 5
        deviation_penalty = abs(self.water_intake - ideal_water_intake) + abs(self.fruit_veg_intake - ideal_fruit_veg_intake)
        score = 10 if deviation_penalty == 0 else max(8 - deviation_penalty, 0)
        return round(score, 2)

    def calculate_sleep_score(self):
        ideal_sleep_hours = 8
        deviation = abs(self.sleep_hours - ideal_sleep_hours)
        score = max(10 - (deviation * 2), 0)
        return round(score, 2)

    def calculate_mental_health_score(self):
        score = (self.stress_level + self.work_life_balance) / 2
        return round(score, 2)

    def calculate_overall_score(self):
        exercise_score = self.calculate_exercise_score()
        nutrition_score = self.calculate_nutrition_score()
        sleep_score = self.calculate_sleep_score()
        mental_health_score = self.calculate_mental_health_score()
        overall_score = (exercise_score * 0.3) + (nutrition_score * 0.3) + (sleep_score * 0.2) + (mental_health_score * 0.2)
        return round(overall_score, 2)

    def get_recommendations(self):
        score = self.calculate_overall_score()
        if score < 5:
            return "Consider significant lifestyle changes. Focus on mindfulness, regular physical activity, and balanced nutrition."
        elif 5 <= score < 7:
            return "You are doing moderately well. Try to improve sleep quality and manage stress better."
        else:
            return "Great job! Maintain your healthy lifestyle and keep up the balanced routine."

st.title("Health and Wellness Score Calculator")

exercise_hours = st.number_input("Weekly Exercise Hours:", min_value=0.0, step=0.5)
exercise_intensity = st.selectbox("Exercise Intensity:", ["Low", "Moderate", "High"])
water_intake = st.number_input("Daily Water Intake (liters):", min_value=0.0, step=0.1)
fruit_veg_intake = st.number_input("Daily Fruit & Vegetable Intake (servings):", min_value=0.0, step=1.0)
sleep_hours = st.number_input("Average Sleep Hours:", min_value=0.0, step=0.5)
stress_level = st.slider("Stress Level (1-10):", min_value=1, max_value=10)
work_life_balance = st.slider("Work-Life Balance (1-10):", min_value=1, max_value=10)

if st.button("Calculate Health Score"):
    calculator = WellnessCalculator(
        exercise_hours=exercise_hours,
        exercise_intensity=exercise_intensity,
        water_intake=water_intake,
        fruit_veg_intake=fruit_veg_intake,
        sleep_hours=sleep_hours,
        stress_level=stress_level,
        work_life_balance=work_life_balance
    )
    overall_score = calculator.calculate_overall_score()
    recommendations = calculator.get_recommendations()

    st.subheader(f"Overall Health Score: {overall_score}")
    st.subheader("Recommendations:")
    st.write(recommendations)

    query_params = st.query_params
    email = query_params.get("email", [""]) 

    try:
        response = requests.post(
            "https://wellnest-5zry.onrender.com/api/test/wellness-score",
            json={"email": email, "score": overall_score}
        )
        if response.status_code == 200:
            st.success(f"Your total Wellness score is: {overall_score}")
        else:
            st.error(f"Failed to save results: {response.text}")
    except Exception as e:
        st.error(f"Error sending score: {e}")