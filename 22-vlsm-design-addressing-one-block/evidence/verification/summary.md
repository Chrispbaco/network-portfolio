# Automated Verification

- Lab: VLSM Design & Addressing: One Block, Four Departments
- Platform: packet-tracer
- Recorded attempt: 2026-08-07T19:40:48.545Z
- Result: Passed
- Score: 5/5 points

| Check | Result | Evidence |
|---|---|---|
| Router1 show ip interface brief — all three subinterfaces up | Passed | [Captured output](./01-pc-subnet-router-brief.txt) |
| PC-Sales ipconfig | Passed | [Captured output](./02-pc-subnet-pc-sales-ipconfig.txt) |
| PC-Eng ipconfig | Passed | [Captured output](./03-pc-subnet-pc-eng-ipconfig.txt) |
| PC-Sales pings PC-Eng across the router | Passed | [Captured output](./04-pc-subnet-ping-sales-to-eng.txt) |
| PC-Sales pings PC-Guest across the router | Passed | [Captured output](./05-pc-subnet-ping-sales-to-guest.txt) |

This report was generated from the saved NetForge lab-attempt record. It reports only checks and output retained by the grader.
