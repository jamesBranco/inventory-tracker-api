# Inventory Tracker

A small full-stack project I built while learning cloud development with AWS and JavaScript. It's a simple app for tracking equipment inventory (name, category, quantity, last checked date) — a serverless backend on AWS, and a React frontend to actually see and interact with the data.

**Live API:** `https://qtdpnt24xi.execute-api.us-east-2.amazonaws.com/`

## What it does

- View a list of all inventory items
- Add a new item through a simple form (name, category, quantity)

It's intentionally simple. The goal was to understand how a real frontend, API, and database connect to each other, not to build something huge.

## Project structure

inventory-tracker/
├── backend/ AWS Lambda function + related config
├── frontend/ React app (built with Vite)
└── README.md


## How it's built

React app (frontend/)
│
│ fetch() calls
▼
API Gateway (the "front door" that receives requests)
│
▼
AWS Lambda (backend/index.js — runs when a request comes in)
│
▼
DynamoDB (where the data actually gets stored)


The backend is "serverless" — I didn't have to set up or manage an actual server. AWS runs my code only when a request comes in, and I only pay for what I actually use.

## What I used

**Backend:**
- **AWS Lambda** – runs my JavaScript (Node.js) code
- **API Gateway** – gives the API a real web address anyone can hit
- **DynamoDB** – stores the data
- **AWS SDK v3** – the library that lets my code talk to DynamoDB
- **AWS CLI** – I set everything up using terminal commands instead of clicking around the AWS website, so I could actually understand what each piece was doing

**Frontend:**
- **React** (with Vite) – the UI
- Plain CSS – no framework, just hand-written styles

## Running the frontend locally

```bash
cd frontend
npm install
npm run dev
```

This starts a local dev server (usually at `http://localhost:5173`) that talks to the live API above.

## Trying the API directly

Get all items:
```bash
curl https://qtdpnt24xi.execute-api.us-east-2.amazonaws.com/
```

Add a new item:
```bash
curl -X POST https://qtdpnt24xi.execute-api.us-east-2.amazonaws.com/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Fire Extinguisher","category":"Safety Equipment","quantity":5}'
```

## Some choices I made (and why)

- I gave every item a random unique ID instead of using something like the item's name to identify it. Two items could technically have the same name, and IDs shouldn't change even if I later edit an item's name.
- I used DynamoDB's "pay per request" pricing instead of the other option, mainly so I wouldn't risk being charged for capacity I wasn't using while learning.
- I kept the frontend and backend in one repo, in separate folders, since I'm the only one working on this and it's easier for someone looking at my work to see the whole project in one place.

## Bugs I ran into (and how I found them)

**"Internal Server Error" with no clear cause.** When I first connected API Gateway to my Lambda function, I kept getting a generic error, and the message pointed at permissions. I spent a while on that, but it turned out not to be the real issue. Turning on API Gateway's own logging (not just Lambda's) helped, but the log message was still misleading. What actually fixed it was deleting the API Gateway setup and rebuilding it with an explicit route instead of the shortcut that auto-generates one.

**The form couldn't add items, but the list loaded fine.** After building the React frontend, GET requests worked but POST requests failed. Checking my API Gateway routes directly showed I'd only ever created a route for `GET /` — never one for `POST /`. Easy to miss since I'd tested GET so many times I assumed the whole API was set up the same way.

**CORS blocked the frontend from reaching the API.** The browser blocked my React app from calling the API at all, even though the exact same request worked fine from the terminal with `curl`. This is a browser security feature (CORS) that has nothing to do with whether the API itself works — I had to explicitly allow requests from other origins in API Gateway's settings.

Biggest lesson from all three: the error message doesn't always point at the real cause, and it's worth checking each layer (frontend, API Gateway, Lambda, database) separately rather than assuming the whole chain works just because one part of it does.

## What I'd still like to add

- Some kind of authentication, so not literally anyone with the link can add data
- Better input validation
- A delete/edit option (right now you can only add and view items)
- Tighter AWS permissions — right now my setup uses fairly broad access (like full admin) just to keep things simple while learning. In a real project I'd lock that down a lot more.

## Why I built this

I'm a student applying for entry-level developer roles, and I wanted to actually build something with the technologies these jobs mention (JavaScript, APIs, cloud, databases) rather than just list them on a resume. This was my first time working with AWS Lambda, API Gateway, and DynamoDB, my first React app, and my first time doing real debugging on a live system instead of just local code.
