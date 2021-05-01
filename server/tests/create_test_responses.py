# Create a fake response to a survey.

# This file started life at
# https://api.qualtrics.com/guides/docs/Guides/Common%20Tasks/survey-response-import-guide.md
# and saw a _lot_ of refactoring.

import datetime
import json
import os
import random
import string
import sys
from datetime import timedelta

import requests
import yaml
from dotenv import load_dotenv

load_dotenv()


def str_generator(size):
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(size))


def gen_answer(question_number, survey):
    for s in survey:
        for q in s.get_question_number():
            if question_number == q:
                possible_answers = s.get_choice_text()()
                return possible_answers[random.randint(0, len(possible_answers) - 1)]


def add_header(line1, line2, line3, f):
    l = line1.strip('\n').split(",")
    f.write(line1)
    f.write(line2)
    f.write(line3)


def add_columns():
    row = []

    # StartDate
    row.append((datetime.datetime.now() + timedelta(days=random.randint(-20, -10))).strftime('%Y-%m-%d %H:%M:%S'))

    # EndDate
    row.append((datetime.datetime.now() + timedelta(days=random.randint(-10, -1))).strftime('%Y-%m-%d %H:%M:%S'))

    # Status
    row.append("IP Address")

    # IPAddress
    row.append(
        "10." + str(random.randint(0, 254)) + "." + str(random.randint(0, 254)) + "." + str(random.randint(0, 254)))

    # Progress
    row.append(100)

    # Duration (in seconds)
    row.append(random.randint(5, 35))

    # Finished
    row.append("TRUE")

    # RecordedDate
    row.append((datetime.datetime.now() + timedelta(days=random.randint(-10, -1))).strftime('%Y-%m-%d %H:%M:%S'))

    # RespondId
    row.append("RS_" + str_generator(14))

    # RecipientFirstName
    row.append(str_generator(random.randint(3, 7)))

    # RecipientLastName
    row.append(str_generator(random.randint(3, 7)))

    # RecipientEmail
    row.append(str_generator(random.randint(3, 7)) + "qualtrics.com")

    # ExternalReference
    row.append("")

    # LocationLatitude
    row.append(random.uniform(-180, 180))

    # LocationLongitude
    row.append(random.uniform(-180, 180))

    # DistributionChannel
    row.append("anonymous")

    # UserLanguage
    row.append("EN")

    return row


def write_row(f, row):
    line = ""
    for r in row:
        line = line + str(r) + ","

    line = line[:-1]
    line += '\n'
    f.write(line)


def add_rows(line1, f, survey):
    a_line = line1.strip('\n').split(",")

    row = add_columns()

    for i in range(17, len(a_line)):
        answer = gen_answer(a_line[i], survey)
        row.append(answer)
    write_row(f, row)


class Question:
    def __init__(self, question_id):
        self.question_type = ""
        self.question_text = ""
        self.question_id = question_id
        self.question_number = []
        self.choice_text = []
        self.sub_questions = []

    def add_question_type(self, question_type):
        self.question_type = question_type['type']

    def add_question_text(self, question_text):
        self.question_text = question_text

    def add_choice_text(self, choice_text):
        for k, v in choice_text.items():
            self.choice_text.append(v['description'])

    def add_question_number(self, export_column_map):
        for k, v in export_column_map.items():
            if v['question'] == self.question_id:
                self.question_number.append(k)

    def add_sub_questions(self, sub_questions):
        for k, v in sub_questions.items():
            self.sub_questions.append(v['description'])

    def get_question_text(self):
        return self.question_text

    def get_choice_text(self):
        return self.choice_text

    def get_question_number(self):
        return self.question_number

    def get_question_id(self):
        return self.question_id

    def get_question_type(self):
        return self.question_type

    def get_sub_questions(self):
        return self.sub_questions

    def get_question(self):
        return self


def read_structure(survey_id, api_token, base_url):
    headers = {'X-API-TOKEN': api_token}
    url = base_url + "/surveys/" + survey_id
    response = requests.get(url, headers=headers)

    d = json.JSONDecoder()
    res = d.decode(response.text)
    # print("RES", json.dumps(res, indent=2))

    r = res['result']
    questions = r['questions']
    export_column_map = r['exportColumnMap']

    survey = []
    for k, v in questions.items():
        question = Question(k)
        question.add_question_number(export_column_map)
        question.add_choice_text(v['choices'])
        survey.append(question)
        question.add_question_type(v['question_type'])
        if question.get_question_type() == "Matrix":
            question.add_sub_questions(v['sub_questions'])
    return survey


def main():
    try:
        api_token = os.environ['QUALTRICS_API_TOKEN']
        base_url = os.environ['QUALTRICS_BASE_URL']
        survey_id = os.environ['QUALTRICS_SURVEY_ID']
    except KeyError:
        print("set environment variables")
        sys.exit(2)

    try:
        num_lines = sys.argv[2]
        file = sys.argv[1]
    except IndexError:
        print("usage: <survey file> <number of responses to generate>")
        sys.exit(2)

    survey = read_structure(survey_id, api_token, base_url)

    i = open(file, "r")
    lines = i.readlines()
    i.close()

    out = open("responses.csv", "w")

    add_header(lines[0], lines[1], lines[2], out)

    for i in range(1, int(num_lines)):
        add_rows(lines[0], out, survey)

    out.close()


if __name__ == "__main__":
    main()
