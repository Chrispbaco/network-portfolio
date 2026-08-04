# Automated Verification

- Lab: VLANs & Trunks: Splitting One Wire Into Many Networks
- Platform: packet-tracer
- Recorded attempt: 2026-08-04T09:57:50.139Z
- Result: Passed
- Score: 7/7 points

| Check | Result | Evidence |
|---|---|---|
| SW1 show vlan brief | Passed | [Captured output](./01-pc-vlans-sw1-vlan-brief.txt) |
| SW1 show interfaces trunk | Passed | [Captured output](./02-pc-vlans-sw1-trunk.txt) |
| SW2 show vlan brief | Passed | [Captured output](./03-pc-vlans-sw2-vlan-brief.txt) |
| PC1 pings PC3 across the trunk, same VLAN | Passed | [Captured output](./04-pc-vlans-ping-same-vlan.txt) |
| PC1 pings PC2, different VLANs, expected failure | Passed | [Captured output](./05-pc-vlans-ping-diff-vlan-fails.txt) |
| Native VLAN mismatch CDP warning | Passed | [Captured output](./06-pc-vlans-mismatch-log.txt) |
| SW2 show interfaces trunk after the fix | Passed | [Captured output](./07-pc-vlans-fixed-trunk.txt) |

This report was generated from the saved NetForge lab-attempt record. It reports only checks and output retained by the grader.
