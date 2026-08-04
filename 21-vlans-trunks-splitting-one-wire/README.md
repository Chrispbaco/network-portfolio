# VLANs and Trunks: Splitting One Wire Into Two Networks

## Project Summary
Segmented two departments across two wiring closets into separate VLANs sharing a single 802.1Q trunk with a non-default native VLAN, then deliberately broke and repaired a native VLAN mismatch to observe the exact CDP warning it produces and understand the security exposure a mismatch represents.

## Topology
6 devices, 5 links (1 trunk, 4 access):
```
PC1 (VLAN 10) --+                                    +-- PC3 (VLAN 10)
                 SW1 --802.1Q trunk, native VLAN 99-- SW2
PC2 (VLAN 20) --+                                    +-- PC4 (VLAN 20)
```

## Objectives
- Created VLANs 10, 20, and 99 on two switches and assigned meaningful names
- Assigned access ports to the correct VLAN on each switch
- Configured an 802.1Q trunk between two switches with a non-default native VLAN
- Verified VLAN and trunk state with show vlan brief and show interfaces trunk
- Confirmed switches never route between VLANs without a Layer 3 device present
- Diagnosed a native VLAN mismatch from its CDP warning, then corrected it

## Skills Demonstrated
- VLAN creation, naming, and access port assignment
- 802.1Q trunking with a non-default native VLAN
- show vlan brief / show interfaces trunk verification
- CDP-based native VLAN mismatch diagnosis
- Same-VLAN vs. cross-VLAN connectivity behavior without a Layer 3 device

## Build & Verification
VLANs 10 (SALES), 20 (ENG), and 99 (NATIVE) were created identically on both switches, with access ports assigned per department and the inter-switch uplink set to trunk with native VLAN 99:

    SW1#show vlan brief
    
    VLAN Name                             Status    Ports
    ---- -------------------------------- --------- -------------------------------
    1    default                          active    Fa0/3, Fa0/4, Fa0/5, Fa0/6
                                                    Fa0/7, Fa0/8, Fa0/9, Fa0/10
                                                    Fa0/11, Fa0/12, Fa0/13, Fa0/14
                                                    Fa0/15, Fa0/16, Fa0/17, Fa0/18
                                                    Fa0/19, Fa0/20, Fa0/21, Fa0/22
                                                    Fa0/23, Fa0/24, Gig0/2
    10   SALES                            active    Fa0/1
    20   ENG                              active    Fa0/2
    99   NATIVE                           active    
    1002 fddi-default                     active    
    1003 token-ring-default               active    
    1004 fddinet-default                  active    
    1005 trnet-default                    active    
    SW1#

    SW1>show interfaces trunk
    Port        Mode         Encapsulation  Status        Native vlan                     
    Gig0/1      on           802.1q         trunking      99
    
    Port        Vlans allowed on trunk
    Gig0/1      1-1005
    
    Port        Vlans allowed and active in management domain
    Gig0/1      1,10,20,99
    
    Port        Vlans in spanning tree forwarding state and not pruned
    Gig0/1      1,10,20,99
    
    SW1>

A same-VLAN ping across the trunk (PC1 to PC3, both VLAN 10) succeeded; a same-closet, cross-VLAN ping (PC1 to PC2) failed with "Destination host unreachable" — expected, since no Layer 3 device was present yet to route between VLANs:

    C:\>ping 192.168.10.13
    
    Pinging 192.168.10.13 with 32 bytes of data:
    
    Reply from 192.168.10.13: bytes=32 time=1ms TTL=128
    Reply from 192.168.10.13: bytes=32 time<1ms TTL=128
    Reply from 192.168.10.13: bytes=32 time<1ms TTL=128
    Reply from 192.168.10.13: bytes=32 time<1ms TTL=128
    
    Ping statistics for 192.168.10.13:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 1ms, Average = 0ms

    C:\>ping 192.168.20.21
    
    Pinging 192.168.20.21 with 32 bytes of data:
    
    Request timed out.
    Request timed out.
    Request timed out.
    Request timed out.
    
    Ping statistics for 192.168.20.21:
        Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
    
    C:\>

The native VLAN was then deliberately mismatched on SW2 to observe CDP's own detection of the fault:

    SW2#
    %CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (10), with SW1 GigabitEthernet0/1 (99).

The mismatch was corrected and the trunk re-verified as consistent on both ends.

The completed build and verification checks reinforced these outcomes:

- Create VLANs 10, 20, and 99 on two switches and name them
- Assign access ports to the correct VLAN on each switch
- Configure an 802.1Q trunk between two switches with a non-default native VLAN
- Verify VLAN and trunk state with show vlan brief and show interfaces trunk
- Diagnose a native VLAN mismatch from Cisco Discovery Protocol (CDP), which advertises directly connected Cisco neighbors and reports link-setting disagreements, then correct it

## Key Configurations

**VLAN creation (identical on both switches):**
```
vlan 10
 name SALES
vlan 20
 name ENG
vlan 99
 name NATIVE
```

**Trunk with non-default native VLAN:**
```
interface gigabitEthernet0/1
 switchport trunk native vlan 99
 switchport mode trunk
```

**Native VLAN mismatch fault (deliberately injected, then reverted):**
```
SW2(config-if)# switchport trunk native vlan 10   ! mismatch vs. SW1's native 99
%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (99), with SW2 GigabitEthernet0/1 (10).
```

## Evidence Package

- NetForge recorded this lab as **passed** on Tue Aug 04 2026.
- Automated score: **7/7 points**.
- [Review the automated grading summary](./evidence/verification/summary.md).
- [Verify artifact hashes](./evidence/manifest.md).

| Artifact | What it proves |
|---|---|
| [splitting-one-wire-into-many-networks.pkt](./evidence/attachments/splitting-one-wire-into-many-networks.pkt) | Reproducible Packet Tracer source |
| [main-proof.png](./evidence/screenshots/main-proof.png) | Learner-captured visual proof |
| [topology.png](./evidence/screenshots/topology.png) | Learner-captured visual proof |
| [01-pc-vlans-sw1-vlan-brief.txt](./evidence/verification/01-pc-vlans-sw1-vlan-brief.txt) | Captured verification output |
| [02-pc-vlans-sw1-trunk.txt](./evidence/verification/02-pc-vlans-sw1-trunk.txt) | Captured verification output |
| [03-pc-vlans-sw2-vlan-brief.txt](./evidence/verification/03-pc-vlans-sw2-vlan-brief.txt) | Captured verification output |
| [04-pc-vlans-ping-same-vlan.txt](./evidence/verification/04-pc-vlans-ping-same-vlan.txt) | Captured verification output |
| [05-pc-vlans-ping-diff-vlan-fails.txt](./evidence/verification/05-pc-vlans-ping-diff-vlan-fails.txt) | Captured verification output |
| [06-pc-vlans-mismatch-log.txt](./evidence/verification/06-pc-vlans-mismatch-log.txt) | Captured verification output |
| [07-pc-vlans-fixed-trunk.txt](./evidence/verification/07-pc-vlans-fixed-trunk.txt) | Captured verification output |
| [summary.md](./evidence/verification/summary.md) | Automated grading report |

### Evidence Integrity

Automated outputs come from the saved NetForge grading record. Screenshots and optional source files are learner-attached artifacts reviewed before public publication. Expected output is never presented as observed output.

