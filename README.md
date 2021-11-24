# Capernaum

Capernaum is a web-based system 
that gathers responses to designated surveys 
taken at Qualtrics. 

When notified of a completed survey by a Qualtrics web hook, 
Capernaum downloads the survey response 
to its PostgreSQL relational database
using the Qualtrics Restful API. 

Capernaum then analyzes the response
and prepares a personalized analysis for the respondent: 
a LaTeX-formatted PDF
containing both a text commentary and graphical visualizations of results. 

Finally, Capernaum emails the PDF to the survey respondent.
