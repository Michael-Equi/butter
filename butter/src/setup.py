from setuptools import setup

setup(
   name='butter_cli',
   version='1.0',
   description='CI/CD for LLM based tools',
   author='Michael Equi',
   author_email='michaelequi@berkeley.edu',
   packages=['butter'],  #same as name
   install_requires=['typer'], #external packages as dependencies
#    scripts=['butter_cli/butter_cli.py']
)