# Router-on-a-Stick: Routing Between VLANs on a Single Link

## Project Summary
Extended a two-VLAN switched network with a router-on-a-stick configuration — one physical router interface split into two 802.1Q-tagged subinterfaces — turning a ping that previously failed with "Destination host unreachable" into a fully-routed, working inter-VLAN path, without adding a second router port.

## Topology
4 devices, 3 links:
```
PC1 (VLAN 10) --access-- SW1 --802.1Q trunk-- Router1 (Gi0/0.10, Gi0/0.20)
PC2 (VLAN 20) --access-- SW1
```

## Objectives
- Configured a trunk between a switch and a router over a single physical link
- Created per-VLAN logical subinterfaces on the router using encapsulation dot1Q
- Assigned end-device default gateways pointing at the correct router subinterface
- Verified subinterface state and VLAN-to-subinterface mapping with show ip interface brief and show interfaces (802.1Q encapsulation line)
- Proved inter-VLAN routing works with a live cross-VLAN ping

## Skills Demonstrated
- 802.1Q trunking between a switch and a router
- Router subinterfaces (router-on-a-stick) and encapsulation dot1Q
- Default gateway configuration for inter-VLAN reachability
- show ip interface brief / show interfaces (802.1Q encapsulation) verification
- Inter-VLAN routing troubleshooting, including the physical-parent-interface dependency

## Build & Verification
SW1's uplink to Router1 was set to trunk mode, carrying both VLAN 10 and VLAN 20 over the single physical link. Router1's Gi0/0 was split into two subinterfaces, each tied to one VLAN's 802.1Q tag and given the first usable address in that VLAN's subnet:

    Router1#show ip interface brief
    Interface              IP-Address      OK? Method Status                Protocol 
    GigabitEthernet0/0     unassigned      YES unset  up                    up 
    GigabitEthernet0/0.10  192.168.10.1    YES manual up                    up 
    GigabitEthernet0/0.20  192.168.20.1    YES manual up                    up 
    GigabitEthernet0/1     unassigned      YES unset  administratively down down 
    Vlan1                  unassigned      YES unset  administratively down down
    Router1#

    C:\>ping 192.168.20.21
    
    Pinging 192.168.20.21 with 32 bytes of data:
    
    Reply from 192.168.20.21: bytes=32 time<1ms TTL=127
    Reply from 192.168.20.21: bytes=32 time=27ms TTL=127
    Reply from 192.168.20.21: bytes=32 time<1ms TTL=127
    Reply from 192.168.20.21: bytes=32 time<1ms TTL=127
    
    Ping statistics for 192.168.20.21:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 27ms, Average = 6ms

With PC1 and PC2 each pointed at their own subnet's subinterface as default gateway, the same cross-VLAN ping that previously failed now succeeded:

    C:\>ping 192.168.20.21
    
    Pinging 192.168.20.21 with 32 bytes of data:
    
    Reply from 192.168.20.21: bytes=32 time<1ms TTL=127
    Reply from 192.168.20.21: bytes=32 time=27ms TTL=127
    Reply from 192.168.20.21: bytes=32 time<1ms TTL=127
    Reply from 192.168.20.21: bytes=32 time<1ms TTL=127
    
    Ping statistics for 192.168.20.21:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 27ms, Average = 6ms

The completed build and verification checks reinforced these outcomes:

- Configure a trunk between a switch and a router with a single physical link
- Create logical subinterfaces on a router, each tagged to one VLAN with encapsulation dot1Q
- Assign a default gateway to end devices pointing at the correct router subinterface
- Verify subinterface state with show ip interface brief and VLAN-to-subinterface mapping with show interfaces (802.1Q encapsulation line)
- Prove inter-VLAN routing works by pinging across VLANs through the router

## Key Configurations

**Switch-side trunk to the router:**
```
interface gigabitEthernet0/1
 switchport mode trunk
```

**Router subinterfaces, one per VLAN:**
```
interface gigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
interface gigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
interface gigabitEthernet0/0
 no shutdown
```

## Evidence Package

- NetForge recorded this lab as **passed** on Wed Aug 05 2026.
- Automated score: **5/5 points**.
- [Review the automated grading summary](./evidence/verification/summary.md).
- [Verify artifact hashes](./evidence/manifest.md).

| Artifact | What it proves |
|---|---|
| [routing-between-vlans.pkt](./evidence/attachments/routing-between-vlans.pkt) | Reproducible Packet Tracer source |
| [scrn1.png](./evidence/screenshots/scrn1.png) | Learner-captured visual proof |
| [scrn2.png](./evidence/screenshots/scrn2.png) | Learner-captured visual proof |
| [01-pc-intervlan-show-ip-int-brief.txt](./evidence/verification/01-pc-intervlan-show-ip-int-brief.txt) | Captured verification output |
| [02-pc-intervlan-show-run-subif.txt](./evidence/verification/02-pc-intervlan-show-run-subif.txt) | Captured verification output |
| [03-pc-intervlan-sw1-vlan-brief.txt](./evidence/verification/03-pc-intervlan-sw1-vlan-brief.txt) | Captured verification output |
| [04-pc-intervlan-ping-success.txt](./evidence/verification/04-pc-intervlan-ping-success.txt) | Captured verification output |
| [05-pc-intervlan-show-vlans.txt](./evidence/verification/05-pc-intervlan-show-vlans.txt) | Captured verification output |
| [summary.md](./evidence/verification/summary.md) | Automated grading report |

### Evidence Integrity

Automated outputs come from the saved NetForge grading record. Screenshots and optional source files are learner-attached artifacts reviewed before public publication. Expected output is never presented as observed output.

