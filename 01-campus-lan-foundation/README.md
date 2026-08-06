# Regional Office Build-Out — Campus LAN Foundation

## Project Summary
Built and verified a two-closet regional office campus LAN in Cisco Packet Tracer: router-on-a-stick inter-VLAN routing, data and voice VLANs serving daisy-chained IP phones, an LACP EtherChannel trunk bonding the two closets, deliberately tuned Spanning Tree root placement, PortFast plus BPDU Guard on every access port, and a dedicated management VLAN with a working default gateway on each switch.

## Topology
9 devices, 10 links, two wiring closets tied together by a bundled trunk:
- **Router1** — router-on-a-stick, four subinterfaces (data VLAN 10, data VLAN 20, voice VLAN 50, management/native VLAN 99)
- **SW1** (Sales closet) — STP root primary, management SVI .11
- **SW2** (Engineering closet) — STP root secondary, management SVI .12
- **PC1/Phone1/PC2** — Sales closet endpoints (PC2 daisy-chained behind Phone1)
- **PC3/Phone2/PC4** — Engineering closet endpoints (PC4 daisy-chained behind Phone2)

```
Router1 --802.1Q trunk (native 99)-- SW1 ==Po1 LACP EtherChannel (2 links, native 99)== SW2
                                       |-- PC1 (VLAN 10)          |-- PC3 (VLAN 20)
                                       |-- Phone1 (VLAN 50) -- PC2 (VLAN 10)
                                                                |-- Phone2 (VLAN 50) -- PC4 (VLAN 20)
```

## Objectives
- Designed and built a two-closet campus LAN: two switches, a router-on-a-stick, and six endpoints across data and voice VLANs
- Configured access ports carrying both a data VLAN and a voice VLAN for daisy-chained IP phone + PC pairs
- Bundled a two-link switch-to-switch uplink into an LACP EtherChannel trunk with a non-default native VLAN
- Tuned Spanning Tree so one specific switch always wins the root election across every VLAN in use
- Hardened every PC/phone-facing access port with PortFast and BPDU Guard
- Stood up a management SVI and default gateway on each switch, reachable through the router
- Ran a full, multi-command verification suite proving every layer of the build actually works, including a resilience test under a failed EtherChannel member

## Skills Demonstrated
- VLANs (data + voice), access port configuration, 802.1Q trunking with a non-default native VLAN
- LACP EtherChannel bundling and verification
- Rapid PVST+ root bridge control (root primary / root secondary)
- PortFast and BPDU Guard as a paired access-port hardening strategy
- Router-on-a-stick inter-VLAN routing with dot1Q subinterfaces, including the native-VLAN subinterface case
- Switch management SVI and default-gateway configuration
- Resilience verification under a simulated link failure

## Build & Verification
The build went in layers: cabling and VLAN creation first, then access ports (including the dual data/voice ports feeding each closet's IP phone), then the EtherChannel trunk between closets, then STP root tuning, and finally the management plane. Each layer was verified before moving to the next:

    SW1>show vlan brief
    
    VLAN Name                             Status    Ports
    ---- -------------------------------- --------- -------------------------------
    1    default                          active    Fa0/3, Fa0/4, Fa0/5, Fa0/6
                                                    Fa0/7, Fa0/8, Fa0/9, Fa0/10
                                                    Fa0/11, Fa0/12, Fa0/13, Fa0/14
                                                    Fa0/15, Fa0/16, Fa0/17, Fa0/18
                                                    Fa0/19, Fa0/20, Fa0/21, Fa0/22
                                                    Gig0/2
    10   SALES-DATA                       active    Fa0/1, Fa0/2
    20   ENG-DATA                         active    
    50   VOICE                            active    Fa0/2
    99   MGMT-NATIVE                      active    
    1002 fddi-default                     active    
    1003 token-ring-default               active    
    1004 fddinet-default                  active    
    1005 trnet-default                    active    
    SW1>

    SW1>show etherchannel summary
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
    
    1      Po1(SU)           LACP   Fa0/23(P) Fa0/24(P) 
    SW1>

    SW1#show spanning-tree vlan 10
    VLAN0010
      Spanning tree enabled protocol ieee
      Root ID    Priority    24586
                 Address     0010.11A5.3412
                 This bridge is the root
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
    
      Bridge ID  Priority    24586  (priority 24576 sys-id-ext 10)
                 Address     0010.11A5.3412
                 Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec
                 Aging Time  20
    
    Interface        Role Sts Cost      Prio.Nbr Type
    ---------------- ---- --- --------- -------- --------------------------------
    Fa0/2            Desg FWD 19        128.2    P2p
    Gi0/1            Desg FWD 4         128.25   P2p
    Fa0/1            Desg FWD 19        128.1    P2p
    
    SW1#

    Router1#show ip interface brief
    Interface              IP-Address      OK? Method Status                Protocol 
    GigabitEthernet0/0     unassigned      YES unset  up                    up 
    GigabitEthernet0/0.10  192.168.10.1    YES manual up                    up 
    GigabitEthernet0/0.20  192.168.20.1    YES manual up                    up 
    GigabitEthernet0/0.50  192.168.50.1    YES manual up                    up 
    GigabitEthernet0/0.99  192.168.99.1    YES manual up                    up 
    GigabitEthernet0/1     unassigned      YES unset  administratively down down 
    Vlan1                  unassigned      YES unset  administratively down down
    Router1#

A full ping suite from PC1 proved same-VLAN, cross-VLAN, and cross-closet management reachability all worked simultaneously:

    C:\>ping 192.168.99.12
    
    Pinging 192.168.99.12 with 32 bytes of data:
    
    Reply from 192.168.99.12: bytes=32 time<1ms TTL=254
    Reply from 192.168.99.12: bytes=32 time=5ms TTL=254
    Reply from 192.168.99.12: bytes=32 time<1ms TTL=254
    Reply from 192.168.99.12: bytes=32 time<1ms TTL=254
    
    Ping statistics for 192.168.99.12:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 5ms, Average = 1ms
    
    C:\>

As a resilience check, one physical member of the EtherChannel bundle was shut down and the inter-VLAN ping was re-run — the logical Po1 interface stayed up and traffic continued over the surviving member with zero reconfiguration:

    SW1>show etherchannel summary
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
    
    1      Po1(SU)           LACP   Fa0/23(P) Fa0/24(P) 
    SW1>

The completed build and verification checks reinforced these outcomes:

- Design and build a two-closet campus LAN: two switches, a router-on-a-stick, and six endpoints across data and voice VLANs
- Configure access ports carrying both a data VLAN and a voice VLAN for a daisy-chained IP phone + PC
- Bundle a two-link switch-to-switch uplink into an LACP EtherChannel trunk with a non-default native VLAN
- Tune Spanning Tree so a specific switch always wins the root election across every VLAN in use
- Harden every PC/phone-facing access port with PortFast and BPDU Guard
- Stand up a management SVI and default gateway on each switch, reachable through the router
- Run a full, multi-command verification suite proving every layer of the build actually works

## Key Configurations

**Dual data + voice VLAN on a single access port (SW1 Fa0/2, Phone1 + PC2):**
```
interface fastEthernet0/2
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 50
 spanning-tree portfast
 spanning-tree bpduguard enable
```

**LACP EtherChannel bundling with a non-default native VLAN (both switches, Fa0/23-24):**
```
interface range fastEthernet0/23-24
 switchport trunk native vlan 99
 switchport mode trunk
 channel-group 1 mode active
```

**Forced STP root primary / secondary across every VLAN in use:**
```
SW1(config)# spanning-tree vlan 10,20,50,99 root primary
SW2(config)# spanning-tree vlan 10,20,50,99 root secondary
```

**Router-on-a-stick subinterfaces, including the native-VLAN case (Router1):**
```
interface gigabitEthernet0/0.99
 encapsulation dot1Q 99 native
 ip address 192.168.99.1 255.255.255.0
```

## Evidence Package

- NetForge recorded this lab as **passed** on Thu Aug 06 2026.
- Automated score: **8/8 points**.
- [Review the automated grading summary](./evidence/verification/summary.md).
- [Verify artifact hashes](./evidence/manifest.md).

| Artifact | What it proves |
|---|---|
| [regional-office-build-out.pkt](./evidence/attachments/regional-office-build-out.pkt) | Reproducible Packet Tracer source |
| [scrn1.png](./evidence/screenshots/scrn1.png) | Learner-captured visual proof |
| [scrn2.png](./evidence/screenshots/scrn2.png) | Learner-captured visual proof |
| [01-pc-boss-sw1-vlan-brief.txt](./evidence/verification/01-pc-boss-sw1-vlan-brief.txt) | Captured verification output |
| [02-pc-boss-sw2-vlan-brief.txt](./evidence/verification/02-pc-boss-sw2-vlan-brief.txt) | Captured verification output |
| [03-pc-boss-etherchannel-summary.txt](./evidence/verification/03-pc-boss-etherchannel-summary.txt) | Captured verification output |
| [04-pc-boss-stp-root.txt](./evidence/verification/04-pc-boss-stp-root.txt) | Captured verification output |
| [05-pc-boss-router-int-brief.txt](./evidence/verification/05-pc-boss-router-int-brief.txt) | Captured verification output |
| [06-pc-boss-default-gateway.txt](./evidence/verification/06-pc-boss-default-gateway.txt) | Captured verification output |
| [07-pc-boss-mgmt-svi.txt](./evidence/verification/07-pc-boss-mgmt-svi.txt) | Captured verification output |
| [08-pc-boss-cross-closet-mgmt-ping.txt](./evidence/verification/08-pc-boss-cross-closet-mgmt-ping.txt) | Captured verification output |
| [summary.md](./evidence/verification/summary.md) | Automated grading report |

### Evidence Integrity

Automated outputs come from the saved NetForge grading record. Screenshots and optional source files are learner-attached artifacts reviewed before public publication. Expected output is never presented as observed output.

