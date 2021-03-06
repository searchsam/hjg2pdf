#!/usr/bin/python3

# Import libraries
import bs4
import sys
import pdfkit
import progress.bar
import requests


def main(theme):
    # Global Vars
    url = "https://hjg.com.ar/vocbib/art/{}.html".format(theme)
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
            "1Sa",
            "2Sa",
            "1Re",
            "2Re",
            "1Cr",
            "1Par",
            "2Cr",
            "2Par",
            "Esd",
            "Neh",
            "1Mac",
            "1Mac",
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
            "Rom",
            "1Cor",
            "2Cor",
            "Gal",
            "Ef",
            "Flp",
            "Col",
            "1Tes",
            "2Tes",
            "1Tim",
            "2Tim",
            "Tit",
            "Flm",
            "Heb",
            "Sant",
            "1Pe",
            "2Pe",
            "1Jn",
            "2Jn",
            "3Jn",
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

        page = soup.find("div", {"id": "main"})
        pdfkit.from_string(
            page.encode("ascii").decode("utf-8"),
            "{}.pdf".format(theme),
            options=options,
            css="dtb.css",
        )

        # To download the whole data set, let's do a for loop through all a tags
        bar1 = progress.bar.Bar("Procesando:", max=len(soup.findAll("cite")))
        for i in range(0, len(soup.findAll("cite"))):
            one_tag = soup.findAll("cite")[i]
            quote = one_tag.string.encode().replace(b"\xc2\xa0", b" ").decode()
            try:
                if quote.split(" ")[0] in quotes_type["primera"]:
                    type = 1
                elif quote.split(" ")[0] in quotes_type["segunda"]:
                    type = 2
                elif quote.split(" ")[0] in quotes_type["tercera"]:
                    type = 3
                elif quote.split(" ")[0] in quotes_type["cuarta"]:
                    type = 4
            except (AttributeError) as e:
                pass
                print(e)

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
        tmp = tmp + '<div id="main"><div class="title">' + theme.title()
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
            tmp,
            "{}-lecturas.pdf".format(theme),
            options=options,
            css="dtb.css",
        )

    else:
        print("Tema no encontrado.")


if __name__ == "__main__":
    # Set the URL you want to webscrape from
    theme = sys.argv[1]
    main(theme)
