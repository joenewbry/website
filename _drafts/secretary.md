---
title: "Secretary: a front desk for personal data"
description: "A draft about humans controlling their data while agents manage access."
draft: true
---
I want humans to control their data, while agents manage access to it.

For me, the first useful version is a lookback: ask what I worked on, find the
relevant parts of my history, and see the evidence behind the answer.

The next version is a front desk for that history. Another agent can ask a
question, but it does not get the keys to everything. It gets a scoped answer,
a denial, or a request for my approval.

I'm calling the idea **Secretary** for now.

## A familiar distinction

Signing in tells the system who you are. It does not decide everything you
should be able to read or do. Secretary would sit between an agent and my
connected data, applying rules I control.

A readable `trust.md` explains the policy. Server code must enforce the limits.
Payment could cover computation, but it should never buy broader access.

## Start with something useful

First, build the owner-only lookback. Then make a synthetic example easy to
self-host. Only after that, add carefully scoped access for other people.

[Explore the proposed architecture](https://ai.digitalsurfacelabs.com/secretary/).
