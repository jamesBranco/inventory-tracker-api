# Inventory Tracker API

This is a small project I built while learning cloud development with AWS and JavaScript. It's a simple API that lets you add and view equipment inventory items (like name, category, and quantity). I built it to get hands-on practice with the tools instead of just reading about them.

**Live API:** `https://qtdpnt24xi.execute-api.us-east-2.amazonaws.com/`

## What it does

You can send a request to the API to:
- Get a list of all inventory items
- Add a new item (name, category, and quantity)

That's it — it's intentionally simple. The goal was to understand how the pieces connect, not to build something huge.

## How it's built
Your browser or curl
│
▼
API Gateway (the "front door" that receives requests)
│
▼
AWS Lambda (the code that runs when a request comes in)
│
▼
DynamoDB (where the data actually gets stored)

I used a "serverless" setup, which basically means I didn't have to set up or manage an actual server — AWS runs my code only when someone makes a request, and I only pay for what I actually use.

## What I used

- **AWS Lambda** – runs my JavaScript (Node.js) code
- **API Gateway** – gives the API a real web address anyone can hit
- **DynamoDB** – stores the data
- **AWS SDK v3** – the library that lets my code talk to DynamoDB
- **AWS CLI** – I set everything up using terminal commands instead of clicking around the AWS website, so I could actually understand what each piece was doing

## Trying it out

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

- I gave every item a random unique ID instead of using something like the item's name to identify it. This is because two items could technically have the same name, and IDs shouldn't change even if I later edit an item's name.
- I used DynamoDB's "pay per request" pricing instead of the other option, mainly so I wouldn't risk being charged for capacity I wasn't using while I was still learning.

## A bug I ran into (and how I found it)

When I first connected API Gateway to my Lambda function, I kept getting a generic "Internal Server Error," and the error message said it was a permissions problem. I spent a while trying to fix permissions, but that wasn't actually the issue.

What helped was turning on logging for API Gateway itself (not just for Lambda), which let me see more detail about what was actually failing. Eventually, instead of continuing to debug the same setup, I deleted the API Gateway piece and rebuilt it more explicitly (specifying the exact route instead of using a shortcut that auto-generates one). That fixed it.

Biggest lesson: the error message AWS gives you doesn't always point to the real cause. Sometimes it's faster to rebuild a suspicious piece than to keep chasing the wrong lead.

## What I'd still like to add

- Some kind of authentication, so not literally anyone with the link can add data
- A frontend (I was planning to build one in React, but ran out of time for this round)
- Better input validation
- Tighter permissions — right now my setup uses fairly broad access (like full admin) just to keep things simple while I was learning. In a real project I'd lock that down a lot more.

## Why I built this

I'm a student applying for entry-level developer roles, and I wanted to actually build something with the technologies these jobs mention (JavaScript, APIs, cloud, databases) rather than just list them on a resume. This was my first time working with AWS Lambda, API Gateway, and DynamoDB, and my first time doing real debugging on a live cloud system instead of just local code.


