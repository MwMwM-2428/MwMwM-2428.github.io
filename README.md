# Michelle Wang (Peifeier) · 王佩菲迩 — personal website

Static site: plain HTML, CSS and JavaScript. No build step needed.

| Page | File |
|---|---|
| Opening ("click to enter") | `index.html` |
| Home | `home.html` |
| Education | `education.html` |
| Projects | `projects.html` |
| Research | `research.html` |
| Life | `life.html` |

`assets/` holds every image, video and the resume PDF. `dc.js` renders the pages, `site.js` handles the
opening screen, the scroll-opening transitions and comment delivery, and `site.css` has the shared tweaks.

## Publish on GitHub Pages

```bash
cd michelle-website
git init
git add .
git commit -m "Launch personal website"
git branch -M main
gh repo create MwMwM-2428.github.io --public --source=. --push
```

The site goes live at https://mwmwm-2428.github.io within a couple of minutes.

## Update later

Edit the files, then:

```bash
git add .
git commit -m "Update site"
git push
```

## Notes

- Comments: pressing Send opens the visitor's email app with their note addressed to mwang2428@gmail.com.
- Visitor marks on the home page are saved in each visitor's own browser only.
- To preview locally: `python3 -m http.server` in this folder, then open http://localhost:8000.
