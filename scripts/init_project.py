#!/usr/bin/env python3

from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def ensure_directories():
    directories = [
        ROOT / 'apps' / 'backend' / 'app' / 'api' / 'v1',
        ROOT / 'apps' / 'backend' / 'app' / 'core',
        ROOT / 'apps' / 'backend' / 'app' / 'db',
        ROOT / 'apps' / 'backend' / 'app' / 'agents',
        ROOT / 'apps' / 'backend' / 'app' / 'schemas',
        ROOT / 'apps' / 'backend' / 'app' / 'services',
        ROOT / 'apps' / 'frontend' / 'src' / 'components',
        ROOT / 'apps' / 'frontend' / 'src' / 'features',
        ROOT / 'apps' / 'sandbox' / 'workspace',
        ROOT / 'docs',
    ]
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)


if __name__ == '__main__':
    ensure_directories()
    print('Project directories initialized.')
