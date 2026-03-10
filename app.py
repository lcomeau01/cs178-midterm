# app.py
from flask import Flask, render_template, request
import duckdb

app = Flask(__name__)

dropdownOptions = ["CGPA", "Internships", "Projects", "Workshops/Certifications", "AptitudeTestScore", "SoftSkillsRating", "SSC_Marks", "HSC_Marks"]
sliderOptions = ["Internships", "Projects", "AptitudeTestScore", "SoftSkillsRating", "SSC_Marks", "HSC_Marks"]
facetOptions = ["ExtracurricularActivities", "PlacementTraining", "PlacementStatus"]

@app.route('/')
def index():
    
    filter_query_parts = []; 
    for col in sliderOptions: 
        filter_query_parts.append(f'MIN("{col}")')
        filter_query_parts.append(f'MAX("{col}")')
    
    filter_ranges_query = f"""
    SELECT {", ".join(filter_query_parts)}
    FROM placementdata.csv
    """

    filter_ranges_results = duckdb.sql(filter_ranges_query).df()
    print(filter_ranges_results)
    filter_ranges = {}
    for col in sliderOptions: 
        col_min = filter_ranges_results[f'min({col})'][0]
        col_max = filter_ranges_results[f'max({col})'][0]

        filter_ranges[col] = (float(col_min), float(col_max))

    return render_template(
        "index.html",
        xOptions=dropdownOptions,
        yOptions=dropdownOptions,
        facetOptions=facetOptions,
        filter_ranges=filter_ranges
    )

if __name__ == '__main__':
    # Run the application if the script is executed directly
    app.run(debug=True)