#!/usr/bin/python3

# Import libraries
import re
import bs4
import sys
import pdfkit
import progress.bar
import requests


def main(url):
    # Global Vars
    options = {
        "page-size": "Letter",
        "margin-top": "0.75in",
        "margin-right": "0.75in",
        "margin-bottom": "0.75in",
        "margin-left": "0.75in",
        "encoding": "utf-8",
        "custom-header": [("Accept-Encoding", "gzip")],
        "no-outline": None,
    }
    type = 0
    quotes_type = {
        "primera": [
            "Gen",
            "Ex",
            "Lev",
            "Num",
            "Dt",
            "Jos",
            "Jue",
            "Rut",
            "1 Sa",
            "2 Sa",
            "1Re",
            "2 Re",
            "1 Cr",
            "1 Par",
            "2 Cr",
            "2 Par",
            "Esd",
            "Neh",
            "1 Mac",
            "1 Mac",
            "Tob",
            "Jdt",
            "Est",
            "Job",
            "Sal",
            "Prov",
            "Ecl",
            "Qo",
            "Cant",
            "Sab",
            "Eclo",
            "Sir",
        ],
        "segunda": [
            "Is",
            "Jer",
            "Lam",
            "Bar",
            "Ez",
            "Dan",
            "Os",
            "Jl",
            "Am",
            "Abd",
            "Jon",
            "Miq",
            "Nah",
            "Hab",
            "Sof",
            "Ag",
            "Zac",
            "Mal",
        ],
        "tercera": [
            "Act",
            "Hec",
            "Hch",
            "Rom",
            "Rm",
            "1 Cor",
            "I Cor",
            "2 Cor",
            "1 Co",
            "2 Co",
            "Gal",
            "Ef",
            "Flp",
            "Col",
            "1 Tes",
            "2 Tes",
            "1 Ts",
            "2 Ts",
            "1 Tim",
            "2 Tim",
            "1 Tm",
            "2 Tm",
            "Tit",
            "Flm",
            "Heb",
            "Hb",
            "Sant",
            "1 Pe",
            "2 Pe",
            "1 Jn",
            "2 Jn",
            "3 Jn",
            "Jds",
            "Ap",
        ],
        "cuarta": ["Mt", "Mc", "Lc", "Jn"],
    }
    order = {1: list(), 2: list(), 3: list(), 4: list()}

    # Connect to the URL
    response = requests.get(url)

    # Read and classificate content
    if int(response.status_code) == 200:
        # Parse HTML and save to BeautifulSoup object
        soup = bs4.BeautifulSoup(response.text, "html.parser")
        page = soup.find("i").getText()
        patron = re.compile(
            r"([0-9]\s[A-Z][a-z]+|[A-Z][a-z]+)(\s[0-9],\s[0-9]+\-[0-9]+|\s[0-9],\s[0-9]+\-[0-9]+|\s[0-9],[0-9]+)"
        )
        p = patron.findall(soup.getText())

        # To download the whole data set, let's do a for loop through all a tags
        bar1 = progress.bar.Bar("Procesando:", max=len(p))
        for i in p:
            quote = i[0] + i[1]
            try:
                if i[0] in quotes_type["primera"]:
                    type = 1
                elif i[0] in quotes_type["segunda"]:
                    type = 2
                elif i[0] in quotes_type["tercera"]:
                    type = 3
                elif i[0] in quotes_type["cuarta"]:
                    type = 4
                else:
                    type = 0
            except (AttributeError) as e:
                pass
                print(e)

            if type > 0:
                order[type].append(quote)

            bar1.next()
        bar1.finish()

        total = 0
        if len(order[1]) > total:
            total = len(order[1])
        if len(order[2]) > total:
            total = len(order[2])
        if len(order[3]) > total:
            total = len(order[3])
        if len(order[4]) > total:
            total = len(order[4])

        tmp = "<!DOCTYPE html><html><head><style>table { width:100%; } table, th, td { border: 1px solid black; border-collapse: collapse; } th, td { padding: 15px; text-align: left; }</style></head><body>"
        tmp = tmp + '<div id="main"><div class="title">' + page.title()
        tmp = (
            tmp
            + "</div><table><tr><th>Primera</th><th>Segunda</th><th>Tercera</th><th>Evangelio</th></tr>"
        )
        for i in range(total):
            tmp = tmp + "<tr>"
            try:
                tmp = tmp + "<td>" + order[1][i] + "</td>"
            except (IndexError):
                tmp = tmp + "<td> </td>"
            try:
                tmp = tmp + "<td>" + order[2][i] + "</td>"
            except (IndexError):
                tmp = tmp + "<td> </td>"
            try:
                tmp = tmp + "<td>" + order[3][i] + "</td>"
            except (IndexError):
                tmp = tmp + "<td> </td>"
            try:
                tmp = tmp + "<td>" + order[4][i] + "</td>"
            except (IndexError):
                tmp = tmp + "<td> </td>"
            tmp = tmp + "</tr>"
        tmp = tmp + "</table></div></body></html>"

        pdfkit.from_string(
            tmp, "{}-lecturas.pdf".format(page), options=options, css="dtb.css"
        )

    else:
        print("Tema no encontrado.")


if __name__ == "__main__":
    # Set the URL you want to webscrape from
    url = sys.argv[1]
    main(url)
