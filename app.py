from flask import Flask, render_template

app = Flask(__name__)

# ----------------------------------------
# Your Portfolio Data (Customize this)
# ----------------------------------------
PERSON = {
    "name": "MERUVU SUHAS",
    "title": "Software Developer",
    "email": "suhas.messi20@gmail.com",
    "phone": "+91 9177888200",
    "location": "INDIA",
    "bio": "I am a passionate software developer with experience in building web applications , AI's and applications.",
    
    "skills": [
        "Python", "Flask", "Django",
        "JavaScript", "React", "CSS",
        "SQL", "Docker"
    ],

    # Pass ONLY filenames — url_for() will be used inside templates
    "mockup_hero": "images/hero-mock.png",

    "projects": [
        {
            "id": "proj-1",
            "title": "CHATBOT",
            "summary": "A BASIC CHATBOT .",
            "stack": ["Python", "FastAPI", "API Integration"],
            "image": "images/chatbot.png",
            "link": "https://github.com/suhaspsl/basic_chatbot.git"
        },
        {
            "id": "proj-2",
            "title": "PORTFOLIO DASHBOARD",
            "summary": "A website to showcase my skills .",
            "stack": ["Python", "js", "css"],
            "image": "images/portfolio.png",
            "link": "#"
        },
       ## {
        ##    "id": "proj-3",
          ##  "title": "Project Three",
          ##  "summary": "A small eCommerce prototype.",
          ##  "stack": ["Django", "Stripe", "TailwindCSS"],
           ## "image": "images/projects-mock3.png",
          ##  "link": "#"
      ##  }
    ]
}


# ----------------------------------------
# Routes
# ----------------------------------------

@app.route('/')
def index():
    return render_template('index.html', person=PERSON)


@app.route('/project/<proj_id>')
def project(proj_id):
    # Find project by ID
    proj = next((p for p in PERSON["projects"] if p["id"] == proj_id), None)
    if not proj:
        return "Project not found", 404
    
    return render_template('project.html', project=proj, person=PERSON)


# ----------------------------------------
# Run the app
# ----------------------------------------

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000)
# To run the app, use the command: python app.py