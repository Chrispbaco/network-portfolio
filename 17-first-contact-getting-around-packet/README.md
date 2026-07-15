# First Contact: Building and Verifying the Simplest LAN

## Project Summary
Built the smallest possible working LAN in Cisco Packet Tracer — two PCs and one switch — to learn the tool's workspace and prove out cabling, static IPv4 addressing, and what actually happens on the wire behind a single ping, captured packet-by-packet in Simulation Mode.

## Topology
3 devices, 2 links, one subnet:
```
PC1 (192.168.1.10/24) --straight-through-- SW1 --straight-through-- PC2 (192.168.1.20/24)
```

## Objectives
- Navigated the Packet Tracer workspace, including the Realtime/Simulation mode toggle
- Cabled two PCs to a switch using the deliberately-chosen copper straight-through cable, never the automatic connector
- Assigned static IPv4 addressing to both end devices
- Verified Layer 1 status via port link-light color before testing connectivity
- Captured and interpreted the ARP exchange and ICMP echo request/reply behind a single ping in Simulation Mode

## Skills Demonstrated
- Packet Tracer workspace navigation (device shelf, connections palette, Realtime/Simulation toggle)
- Deliberate cable-type selection over auto-connect
- Static IPv4 addressing
- Link-light-based Layer 1 verification
- ARP resolution and ICMP echo mechanics
- Packet-level protocol analysis in Simulation Mode

## Build & Verification
PC1 and PC2 were cabled to SW1 with copper straight-through links and addressed statically in 192.168.1.0/24. Before any ping was sent, Simulation Mode was filtered down to ARP and ICMP only, then a single ping from PC1 to PC2 was stepped through one event at a time: _See the verified outputs and attached captures in the evidence package below_. The first packet off PC1 was an ARP request, not ICMP — proof that address resolution has to complete before the actual echo request can be framed. Only after PC2's ARP reply landed did the ICMP echo request/reply pair cross the wire.

    C:\>ping 192.168.1.20
    
    Pinging 192.168.1.20 with 32 bytes of data:
    
    Reply from 192.168.1.20: bytes=32 time<1ms TTL=128
    Reply from 192.168.1.20: bytes=32 time<1ms TTL=128
    Reply from 192.168.1.20: bytes=32 time<1ms TTL=128
    Reply from 192.168.1.20: bytes=32 time=3ms TTL=128
    
    Ping statistics for 192.168.1.20:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 3ms, Average = 0ms
    
    C:\>

    C:\>ipconfig
    
    FastEthernet0 Connection:(default port)
    
       Connection-specific DNS Suffix..: 
       Link-local IPv6 Address.........: FE80::20A:F3FF:FE91:C3E9
       IPv6 Address....................: ::
       IPv4 Address....................: 192.168.1.20
       Subnet Mask.....................: 255.255.255.0
       Default Gateway.................: ::
                                         0.0.0.0
    
    Bluetooth Connection:
    
       Connection-specific DNS Suffix..: 
       Link-local IPv6 Address.........: ::

The completed build and verification checks reinforced these outcomes:

- Navigate the Packet Tracer workspace: device-type shelf, model tray, connections palette, Realtime/Simulation toggle
- Place two PCs and a switch and cable them with the correct cable type instead of the Automatic (lightning bolt) option
- Assign static Internet Protocol version 4 (IPv4) addresses to end devices via Desktop → IP Configuration
- Read port link-light colors to confirm a physical connection is up
- Use Simulation Mode to capture Address Resolution Protocol (ARP) address lookup and Internet Control Message Protocol (ICMP) ping request/reply traffic

## Key Configurations

**Static IPv4 addressing:**
```
PC1: 192.168.1.10 / 255.255.255.0 (no gateway — single subnet)
PC2: 192.168.1.20 / 255.255.255.0 (no gateway — single subnet)
```

**Cabling rule enforced throughout:**
```
Copper Straight-Through only — the Automatic (lightning bolt) connector is never used,
since it hides the straight-through/crossover/console decision the exam requires.
```

**Expected Realtime ping result (PC1 -> PC2):**
```
Pinging 192.168.1.20 with 32 bytes of data:
Reply from 192.168.1.20: bytes=32 time<1ms TTL=128 (x4)
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
```

## Evidence Package

- NetForge recorded this lab as **passed** on Tue Jul 14 2026.
- Automated score: **2/2 points**.
- [Review the automated grading summary](./evidence/verification/summary.md).
- [Verify artifact hashes](./evidence/manifest.md).

| Artifact | What it proves |
|---|---|
| [lab1.pkt](./evidence/attachments/lab1.pkt) | Reproducible Packet Tracer source |
| [screenshot1.png](./evidence/screenshots/screenshot1.png) | Learner-captured visual proof |
| [screenshot2.png](./evidence/screenshots/screenshot2.png) | Learner-captured visual proof |
| [01-pc-first-contact-ping.txt](./evidence/verification/01-pc-first-contact-ping.txt) | Captured verification output |
| [02-pc-first-contact-ipconfig.txt](./evidence/verification/02-pc-first-contact-ipconfig.txt) | Captured verification output |
| [summary.md](./evidence/verification/summary.md) | Automated grading report |

### Evidence Integrity

Automated outputs come from the saved NetForge grading record. Screenshots and optional source files are learner-attached artifacts reviewed before public publication. Expected output is never presented as observed output.

