#!/usr/bin/env bash

# This script takes two arguments and exports them as environment variables.

if [ "$#" -ne 2 ]; then
    echo "Usage: ./hcaptcha.sh <your_hcaptcha_sitekey> <your_hcaptcha_secret_key>" 
    exit 1
fi

export HCAPTCHA_SITEKEY="$1"

export HCAPTCHA_SECRET="$2"

echo "Environment variable HCAPTCHA_SITEKEY has been set to: $HCAPTCHA_SITEKEY"
echo "Environment variable HCAPTCHA_SECRET has been set to: $HCAPTCHA_SECRET"
