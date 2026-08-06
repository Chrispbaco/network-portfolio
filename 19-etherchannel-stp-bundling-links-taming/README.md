# EtherChannel and Spanning Tree: Bundling Links, Taming the Root

## Project Summary
Took two switches connected by two redundant parallel links — one of which Spanning Tree was silently blocking to prevent a loop — and bundled them into a single LACP EtherChannel to reclaim the wasted bandwidth. Then forced deliberate root bridge placement and hardened both PC-facing ports with PortFast and BPDU Guard, verified by actually triggering and recovering from a BPDU Guard trip.

## Topology
5 devices at peak (4 in the finished build, plus a temporary rogue switch used for the BPDU Guard test), 2 bundled inter-switch links plus 2 access links:
```
PC1 --straight-through-- SW1 ==Po1 LACP (Gi0/1 + Gi0/2)== SW2 --straight-through-- PC2
```

## Objectives
- Observed Spanning Tree blocking one of two redundant parallel links before configuring EtherChannel
- Bundled two parallel links between switches into a single LACP EtherChannel
- Verified EtherChannel state with show etherchannel summary
- Forced a specific switch to win the STP root election with spanning-tree root primary
- Configured PortFast and BPDU Guard on access ports, then triggered and recovered from an actual BPDU Guard err-disable event using an unauthorized switch

## Skills Demonstrated
- LACP EtherChannel bundling and verification
- STP root bridge election mechanics and manual tuning
- PortFast and BPDU Guard as a paired access-port hardening strategy
- err-disable diagnosis and manual port recovery (shutdown / no shutdown)

## Build & Verification
Before any EtherChannel configuration, `show spanning-tree vlan 1` confirmed one of the two parallel SW1-SW2 links was already in STP's `Altn`/`BLK` state, discarding traffic to prevent a Layer 2 loop:

    SW1#show spanning-tree vlan 1
    VLAN0001
      Spanning tree enabled protocol ieee
      Root ID    Priority    24577
                 Address     000D.BDC6.5C51
                 This bridge is the root
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
    
      Bridge ID  Priority    24577  (priority 24576 sys-id-ext 1)
                 Address     000D.BDC6.5C51
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
                 Aging Time  20
    
    Interface        Role Sts Cost      Prio.Nbr Type
    ---------------- ---- --- --------- -------- --------------------------------
    Fa0/1            Desg FWD 19        128.1    P2p
    Po1              Desg FWD 3         128.27   P2p
    
    SW1#

Both links were then bundled with `channel-group 1 mode active` on each switch, forming `Po1`:

    SW1#show etherchannel summary
    Flags:  D - down        P - in port-channel
            I - stand-alone s - suspended
            H - Hot-standby (LACP only)
            R - Layer3      S - Layer2
            U - in use      f - failed to allocate aggregator
            u - unsuitable for bundling
            w - waiting to be aggregated
            d - default port
    
    
    Number of channel-groups in use: 1
    Number of aggregators:           1
    
    Group  Port-channel  Protocol    Ports
    ------+-------------+-----------+----------------------------------------------
    
    1      Po1(SU)           LACP   Gig0/1(P) Gig0/2(P) 
    SW1#

SW1 was forced to win the root election deliberately rather than by chance of MAC address:

    SW1#show spanning-tree vlan 1
    VLAN0001
      Spanning tree enabled protocol ieee
      Root ID    Priority    24577
                 Address     000D.BDC6.5C51
                 This bridge is the root
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
    
      Bridge ID  Priority    24577  (priority 24576 sys-id-ext 1)
                 Address     000D.BDC6.5C51
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
                 Aging Time  20
    
    Interface        Role Sts Cost      Prio.Nbr Type
    ---------------- ---- --- --------- -------- --------------------------------
    Fa0/1            Desg FWD 19        128.1    P2p
    Po1              Desg FWD 3         128.27   P2p
    
    SW1#

PortFast and BPDU Guard were applied to both PC-facing ports. To prove the guard actually works, an unconfigured switch was connected to SW1's guarded port in place of PC1 — the port err-disabled itself the instant a BPDU arrived:

_See the verified outputs and attached captures in the evidence package below_

After removing the rogue switch and reconnecting PC1, the port was manually recovered:

    SW1#show interfaces fastEthernet0/1 status
    Port      Name               Status       Vlan       Duplex  Speed Type
    Fa0/1                        connected    1          a-full  a-100 10/100BaseTX
    
    SW1#

The completed build and verification checks reinforced these outcomes:

- Bundle two parallel links between switches into a single LACP EtherChannel
- Verify EtherChannel state with show etherchannel summary
- Identify the current STP root bridge with show spanning-tree
- Force a specific switch to become the STP root using spanning-tree root primary
- Configure PortFast and BPDU Guard on access ports and observe BPDU Guard trip an unauthorized port

## Key Configurations

**Bundling both parallel links into an LACP EtherChannel (both switches):**
```
interface range gigabitEthernet0/1-2
 channel-group 1 mode active
```

**Forcing deliberate STP root placement:**
```
SW1(config)# spanning-tree vlan 1 root primary
```

**PortFast + BPDU Guard on a PC-facing access port:**
```
interface fastEthernet0/1
 spanning-tree portfast
 spanning-tree bpduguard enable
```

## Evidence Package

- NetForge recorded this lab as **passed** on Wed Aug 05 2026.
- Automated score: **5/5 points**.
- [Review the automated grading summary](./evidence/verification/summary.md).
- [Verify artifact hashes](./evidence/manifest.md).

| Artifact | What it proves |
|---|---|
| [ccna-lab-m02-etherchannel-stp.pkt](./evidence/attachments/ccna-lab-m02-etherchannel-stp.pkt) | Reproducible Packet Tracer source |
| [scrn1.png](./evidence/screenshots/scrn1.png) | Learner-captured visual proof |
| [scrn2.png](./evidence/screenshots/scrn2.png) | Learner-captured visual proof |
| [01-pc-ec-stp-bundle-forwarding.txt](./evidence/verification/01-pc-ec-stp-bundle-forwarding.txt) | Captured verification output |
| [02-pc-ec-summary.txt](./evidence/verification/02-pc-ec-summary.txt) | Captured verification output |
| [03-pc-ec-stp-root.txt](./evidence/verification/03-pc-ec-stp-root.txt) | Captured verification output |
| [04-pc-ec-portfast-config.txt](./evidence/verification/04-pc-ec-portfast-config.txt) | Captured verification output |
| [05-pc-ec-status-recovered.txt](./evidence/verification/05-pc-ec-status-recovered.txt) | Captured verification output |
| [summary.md](./evidence/verification/summary.md) | Automated grading report |

### Evidence Integrity

Automated outputs come from the saved NetForge grading record. Screenshots and optional source files are learner-attached artifacts reviewed before public publication. Expected output is never presented as observed output.

