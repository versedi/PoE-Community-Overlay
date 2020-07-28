import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { Item, ItemCategory, Language } from '../../type'

@Component({
  selector: 'app-item-frame-properties',
  templateUrl: './item-frame-properties.component.html',
  styleUrls: ['./item-frame-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFramePropertiesComponent implements OnInit {
  @Input()
  public item: Item

  @Input()
  public queryItem: Item

  @Input()
  public language: Language

  @Input()
  public properties: string[]

  @Input()
  public minRange: number

  @Input()
  public maxRange: number

  public isWeapon: boolean
  public isArmour: boolean

  public ngOnInit(): void {
    this.properties = this.properties || [
      'weaponCriticalStrikeChance',
      'weaponAttacksPerSecond',
      'weaponRange',
      'shieldBlockChance',
      'armourArmour',
      'armourEvasionRating',
      'armourEnergyShield',
      'stackSize',
      'gemLevel',
      'mapTier',
      'mapQuantity',
      'mapRarity',
      'mapPacksize',
      'quality',
      'gemExperience',
      'prophecyText',
      'durability',
      'storedExperience',
    ]
    this.isArmour = this.item.category?.startsWith(ItemCategory.Armour) || false
    this.isWeapon = this.item.category?.startsWith(ItemCategory.Weapon) || false
  }
}
