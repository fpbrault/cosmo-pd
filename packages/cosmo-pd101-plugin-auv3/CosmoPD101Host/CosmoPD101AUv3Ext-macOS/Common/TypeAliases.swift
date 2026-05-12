//
//  TypeAliases.swift
//  CosmoPD101AUv3Ext-macOS
//
//  Created by Felix Perron-Brault on 2026-05-06.
//

import CoreMIDI
import AudioToolbox

#if os(iOS) || os(visionOS)
import UIKit

public typealias ViewController = UIViewController
#elseif os(macOS)
import AppKit

public typealias KitView = NSView
public typealias ViewController = NSViewController
#endif
