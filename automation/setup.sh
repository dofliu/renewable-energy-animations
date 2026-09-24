#!/bin/bash
# Cloud environment setup script for the daily animation routine.
# Paste this into the routine environment's "Setup script" field (the result is cached).
set -e
pip install --quiet playwright pillow
python -m playwright install --with-deps chromium
