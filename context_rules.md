# Context Rules for SW-Domains Repository

## Overview
This document establishes the requirement to use specific context files for all development tasks in this repository.

## Context Files Location
All context files are located in the `/context` directory and must be referenced for every task, current and future, related to this repository.

### Required Context Files:
- `context/prd_phase_one.md` (24,338 bytes) - Product Requirements Document for Phase One
- `context/security_extension_whitepaper.md` (39,238 bytes) - Security Extension Whitepaper
- `context/technical_considerations_document.md` (16,195 bytes) - Technical Considerations Document

## Rules for Development Tasks

### 1. Mandatory Context Review
Before starting any development task, bug fix, feature implementation, or code modification:
- Review all three context documents
- Ensure understanding of the project's security requirements
- Align implementation with the phase one product requirements
- Consider technical constraints and considerations outlined in the documents

### 2. Decision Making
All technical decisions must be made with reference to:
- Security guidelines from the security extension whitepaper
- Product requirements from the PRD phase one document
- Technical constraints from the technical considerations document

### 3. Code Quality Standards
- All code must meet the security standards outlined in the context documents
- Implementation must align with the architectural decisions documented
- Features must fulfill the requirements specified in the PRD

### 4. Documentation Updates
When making changes:
- Update relevant documentation to reflect changes
- Ensure consistency with the context documents
- Document any deviations from the original specifications with justification

## Enforcement
This rule applies to:
- All current development tasks
- All future development tasks
- Bug fixes and maintenance
- Feature additions and modifications
- Code reviews and quality assurance

## Note
The context directory is gitignored to protect sensitive information, but these documents remain the authoritative source for project requirements and constraints.

---
*Created: 2025-09-16*
*Purpose: Ensure consistent use of project context across all development activities*
