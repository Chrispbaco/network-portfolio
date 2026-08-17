# Automated Verification

- Lab: Static Routes: Wiring Up the First Branch Office
- Platform: packet-tracer
- Recorded attempt: 2026-08-17T04:45:59.893Z
- Result: Passed
- Score: 7/7 points

| Check | Result | Evidence |
|---|---|---|
| HQ-R1 show ip route static — default, standard, and host routes | Passed | [Captured output](./01-pc-static-hq-route-table.txt) |
| HQ-R1 show ip route 192.168.20.50 — confirms longest-prefix-match | Passed | [Captured output](./02-pc-static-hq-host-route-detail.txt) |
| HQ-R1 running-config confirms the floating static exists | Passed | [Captured output](./03-pc-static-hq-floating-configured.txt) |
| Branch-R2 show ip route static — standard and default routes | Passed | [Captured output](./04-pc-static-branch-r2-routes.txt) |
| PC-HQ pings Branch-NVR over the transit-path host route | Passed | [Captured output](./05-pc-static-ping-nvr.txt) |
| PC-HQ pings Internet-Server, proving the default route works | Passed | [Captured output](./06-pc-static-ping-internet-server.txt) |
| HQ-R1 routing table after the primary link is shut — floating static now installed | Passed | [Captured output](./07-pc-static-floating-installed-after-break.txt) |

This report was generated from the saved NetForge lab-attempt record. It reports only checks and output retained by the grader.
