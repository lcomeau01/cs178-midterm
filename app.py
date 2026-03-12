# app.py
from flask import Flask, render_template, request
import duckdb
import json  

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

@app.route("/update_scatter", methods=["POST"])
def update_scatter(): 
    request_data = request.get_json()

    x = request_data["xOption"]
    y = request_data["yOption"]
    facet = request_data["facetOption"]

    params =  request_data["params"]
    predicates = []
    for col, val in params.items():
            predicates.append(f'"{col}" >= {val[0]} AND "{col}" <= {val[1]}')

    where_clause = " AND ".join(predicates) if predicates else "1=1"

    scatter_query = f"""
    SELECT "{x}" AS X,
           "{y}" AS Y,
           "{facet}" AS facet
    FROM placementdata.csv
    WHERE {where_clause}
    """
    
    scatter_results = duckdb.sql(scatter_query).df()
    scatter_data = [{'x': float(row['X']), 'y': float(row['Y']), 'facet': row['facet']} for _, row in scatter_results.iterrows()]

    return {
        "data": scatter_data, 
        "x_column": x,
        "y_column": y,
        "facet_column": facet, 
    }

if __name__ == '__main__':
    # Run the application if the script is executed directly
    app.run(debug=True)