# Automated Verification

- Lab: BOSS: The Regional Office Build-Out
- Platform: packet-tracer
- Recorded attempt: 2026-08-06T13:54:51.306Z
- Result: Passed
- Score: 8/8 points

| Check | Result | Evidence |
|---|---|---|
| SW1 show vlan brief — data and voice VLANs | Passed | [Captured output](./01-pc-boss-sw1-vlan-brief.txt) |
| SW2 show vlan brief — data and voice VLANs | Passed | [Captured output](./02-pc-boss-sw2-vlan-brief.txt) |
| SW1 show etherchannel summary | Passed | [Captured output](./03-pc-boss-etherchannel-summary.txt) |
| SW1 confirmed root for VLAN 10 | Passed | [Captured output](./04-pc-boss-stp-root.txt) |
| Router1 show ip interface brief — all four subinterfaces | Passed | [Captured output](./05-pc-boss-router-int-brief.txt) |
| SW1 default gateway configured | Passed | [Captured output](./06-pc-boss-default-gateway.txt) |
| SW1 management SVI up with correct IP | Passed | [Captured output](./07-pc-boss-mgmt-svi.txt) |
| PC1 reaches SW2's management SVI across the whole build | Passed | [Captured output](./08-pc-boss-cross-closet-mgmt-ping.txt) |

This report was generated from the saved NetForge lab-attempt record. It reports only checks and output retained by the grader.
