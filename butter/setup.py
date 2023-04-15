from setuptools import setup, find_packages

setup(
   name='butter-cli',
   version='1.11',
   description='CI/CD for generative AI',
   author='Michael Equi',
   author_email='michaelequi@berkeley.edu',
   packages=find_packages('src'),  #same as name
   package_dir={'': 'src'},
   entry_points={
        'console_scripts': [
            'butter=butter.cli:app',  # Replace 'butter_cli.main:main' with the actual path to your main function
        ],
   },
   url='https://github.com/Michael-Equi/butter',
   install_requires=['typer', 'gitpython', 'rich'], #external packages as dependencies
#    scripts=['butter_cli/butter_cli.py']
)