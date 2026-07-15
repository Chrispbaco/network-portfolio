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
PC1 and PC2 were cabled to SW1 with copper straight-through links and addressed statically in 192.168.1.0/24. Before any ping was sent, Simulation Mode was filtered down to ARP and ICMP only, then a single ping from PC1 to PC2 was stepped through one event at a time: {{sim_mode_capture_notes}}. The first packet off PC1 was an ARP request, not ICMP — proof that address resolution has to complete before the actual echo request can be framed. Only after PC2's ARP reply landed did the ICMP echo request/reply pair cross the wire.

{{realtime_ping_output}}

{{ipconfig_output}}

_See notes below._

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