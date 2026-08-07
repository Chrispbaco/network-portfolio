# VLSM Design: One /24 Block, Four Right-Sized Subnets

## Project Summary
Designed and implemented a VLSM addressing plan carving a single /24 block into four differently-sized subnets — Sales, Engineering, Guest Wi-Fi, and a reserved future WAN link — then built and verified the router-on-a-stick network that put the plan into production with zero wasted address space.

## Topology
5 devices, 4 links (1 trunk, 3 access):
```
PC-Sales (192.168.1.0/26) --+
PC-Eng (192.168.1.64/27)   --+-- SW1 --802.1Q trunk-- Router1 (Gi0/0.10 .20 .30)
PC-Guest (192.168.1.96/28) --+
                                              192.168.1.112/30 reserved for a future WAN link
```

## Objectives
- Designed a VLSM plan for four departments of different sizes from a single /24 block, allocating largest-to-smallest to avoid fragmentation
- Converted each subnet's prefix length into the correct dotted-decimal subnet mask
- Addressed a router's subinterfaces and PCs to match the VLSM plan exactly
- Verified addressing with show ip interface brief and ipconfig
- Proved the design with cross-department pings routed through one router

## Skills Demonstrated
- VLSM subnet design and largest-to-smallest allocation discipline
- Prefix-length-to-dotted-decimal-mask conversion
- Router-on-a-stick subinterface addressing matched to a VLSM plan
- Subnet mask troubleshooting and verification

## Build & Verification
The VLSM plan was worked out on paper before any device configuration: Sales (50 hosts) got a /26, Engineering (25 hosts) a /27, Guest Wi-Fi (10 hosts) a /28, and a future WAN link a reserved /30 — each block starting exactly where the previous one ended, with no gaps or overlap:

_See the verified outputs and attached captures in the evidence package below_

Router1's three subinterfaces and all three PCs were addressed to match the plan exactly, each with its own subnet's specific dotted-decimal mask rather than one mask reused everywhere:

    Router1#show ip interface brief
    Interface              IP-Address      OK? Method Status                Protocol 
    GigabitEthernet0/0     unassigned      YES unset  up                    up 
    GigabitEthernet0/0.10  192.168.1.1     YES manual up                    up 
    GigabitEthernet0/0.20  192.168.1.65    YES manual up                    up 
    GigabitEthernet0/0.30  192.168.1.97    YES manual up                    up 
    GigabitEthernet0/1     unassigned      YES unset  administratively down down 
    Vlan1                  unassigned      YES unset  administratively down down
    Router1#

    C:\>ipconfig
    
    FastEthernet0 Connection:(default port)
    
       Connection-specific DNS Suffix..: 
       Link-local IPv6 Address.........: FE80::203:E4FF:FEB3:EA
       IPv6 Address....................: ::
       IPv4 Address....................: 192.168.1.2
       Subnet Mask.....................: 255.255.255.192
       Default Gateway.................: ::
                                         192.168.1.1
    
    Bluetooth Connection:
    
       Connection-specific DNS Suffix..: 
       Link-local IPv6 Address.........: ::
       IPv6 Address....................: ::
       IPv4 Address....................: 0.0.0.0
       Subnet Mask.....................: 0.0.0.0
       Default Gateway.................: ::
                                         0.0.0.0
    
    C:\>

Cross-department pings from PC-Sales to both PC-Eng and PC-Guest confirmed the design worked end to end through Router1's inter-VLAN routing:

    C:\>ping 192.168.1.66
    
    Pinging 192.168.1.66 with 32 bytes of data:
    
    Reply from 192.168.1.66: bytes=32 time<1ms TTL=127
    Reply from 192.168.1.66: bytes=32 time<1ms TTL=127
    Reply from 192.168.1.66: bytes=32 time<1ms TTL=127
    Reply from 192.168.1.66: bytes=32 time<1ms TTL=127
    
    Ping statistics for 192.168.1.66:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 0ms, Average = 0ms
    
    C:\>

The completed build and verification checks reinforced these outcomes:

- Design a VLSM plan for four departments of different sizes from a single /24 block
- Convert each subnet's prefix length into the correct dotted-decimal subnet mask
- Address a router's subinterfaces and PCs to match the VLSM plan
- Verify addressing with show ip interface brief and ipconfig
- Prove the design works with cross-department pings routed through one router

## Key Configurations

**VLSM allocation table:**
| Department | Hosts needed | Subnet | Mask |
|---|---|---|---|
| Sales | 50 | 192.168.1.0/26 | 255.255.255.192 |
| Engineering | 25 | 192.168.1.64/27 | 255.255.255.224 |
| Guest Wi-Fi | 10 | 192.168.1.96/28 | 255.255.255.240 |
| WAN link (reserved) | 2 | 192.168.1.112/30 | 255.255.255.252 |

**Router subinterfaces addressed per the plan:**
```
interface gigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 192.168.1.1 255.255.255.192
interface gigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 192.168.1.65 255.255.255.224
interface gigabitEthernet0/0.30
 encapsulation dot1Q 30
 ip address 192.168.1.97 255.255.255.240
```

## Evidence Package

- NetForge recorded this lab as **passed** on Fri Aug 07 2026.
- Automated score: **5/5 points**.
- [Review the automated grading summary](./evidence/verification/summary.md).
- [Verify artifact hashes](./evidence/manifest.md).

| Artifact | What it proves |
|---|---|
| [vslm-design-addressing-one-block-four-deparments.pkt](./evidence/attachments/vslm-design-addressing-one-block-four-deparments.pkt) | Reproducible Packet Tracer source |
| [scrn1.png](./evidence/screenshots/scrn1.png) | Learner-captured visual proof |
| [scrn2.png](./evidence/screenshots/scrn2.png) | Learner-captured visual proof |
| [01-pc-subnet-router-brief.txt](./evidence/verification/01-pc-subnet-router-brief.txt) | Captured verification output |
| [02-pc-subnet-pc-sales-ipconfig.txt](./evidence/verification/02-pc-subnet-pc-sales-ipconfig.txt) | Captured verification output |
| [03-pc-subnet-pc-eng-ipconfig.txt](./evidence/verification/03-pc-subnet-pc-eng-ipconfig.txt) | Captured verification output |
| [04-pc-subnet-ping-sales-to-eng.txt](./evidence/verification/04-pc-subnet-ping-sales-to-eng.txt) | Captured verification output |
| [05-pc-subnet-ping-sales-to-guest.txt](./evidence/verification/05-pc-subnet-ping-sales-to-guest.txt) | Captured verification output |
| [summary.md](./evidence/verification/summary.md) | Automated grading report |

### Evidence Integrity

Automated outputs come from the saved NetForge grading record. Screenshots and optional source files are learner-attached artifacts reviewed before public publication. Expected output is never presented as observed output.

