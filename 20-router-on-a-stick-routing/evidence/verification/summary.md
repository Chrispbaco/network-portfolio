# Automated Verification

- Lab: Router-on-a-Stick: Routing Between VLANs
- Platform: packet-tracer
- Recorded attempt: 2026-08-05T08:35:35.493Z
- Result: Passed
- Score: 5/5 points

| Check | Result | Evidence |
|---|---|---|
| Router1 show ip interface brief | Passed | [Captured output](./01-pc-intervlan-show-ip-int-brief.txt) |
| Router1 subinterface running-config | Passed | [Captured output](./02-pc-intervlan-show-run-subif.txt) |
| SW1 show vlan brief | Passed | [Captured output](./03-pc-intervlan-sw1-vlan-brief.txt) |
| PC1 pings PC2 across VLANs — now succeeds | Passed | [Captured output](./04-pc-intervlan-ping-success.txt) |
| Router1 show interfaces (802.1Q subinterface-to-VLAN mapping) | Passed | [Captured output](./05-pc-intervlan-show-vlans.txt) |

This report was generated from the saved NetForge lab-attempt record. It reports only checks and output retained by the grader.
