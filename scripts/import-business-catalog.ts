import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { businessCatalogService } from "../platform/services/business-catalog";
import { businessPricingService } from "../platform/services/business-pricing";

const userId =
  "5b44469c-4ad3-40c0-804a-3ae0cc053cd7";

const organizationId =
  "8bc86409-0d84-4427-b53f-1676021674cf";

const workspaceId =
  "6db85bca-3688-4eb4-adb8-2e94da18e88e";

const legacyCatalogItemId =
  "a8632011-3c05-41b4-af25-2dc14851e63d";

const products = [
  ["7502266070542","CLORO 20 LTS SILTEC PREMIUM","Limpieza General","BIDON",162.93,"https://images.unsplash.com/photo-1581578731548-c64695cc6952"],
  ["7509546653723","FABULOSO 10 LTS AROMA LAVANDA","Limpieza General","GALON",162.06,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["101100022","GEL ANTIBACTERIAL 5 LTS CERTIFICADO","Higiene y DesinfecciÃƒÂ³n","GALON",224.13,"https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"],
  ["614143401510","DETERGENTE AUDAX MULTIUSOS 10 KGS","Detergentes","BULTO",228,"https://images.unsplash.com/photo-1626808642875-0aa545482dfb"],
  ["7502266071716","BLOSS 5 LTS JABÃƒâ€œN LÃƒÂQUIDO P/MANOS","Jabones","GALON",100,"https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"],
  ["HB19318","DALIA HD180 HIGIÃƒâ€°NICO EN BOBINA","Papel HigiÃƒÂ©nico","CAJA",230,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["92231","TOALLA SANITAS HOJA DOBLE","Toallas y Servilletas","CAJA",185.34,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["TR03690","FAPSA ECO K160 TOALLA EN ROLLO","Toallas y Servilletas","CAJA",220,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["SE19450","SERVILLETA DALIA TRADICIONAL","Toallas y Servilletas","PQT",29.98,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["BN6090","BOLSA NEGRA HERCULES 60X90 CMS","Bolsas y Empaque","KG",44.85,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7503013673344","BOLSA NEGRA ANGUIPLAST 90X120 CM","Bolsas y Empaque","KG",39.99,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["GPS90120","BOLSA NEGRA GPS 90X120 CM","Bolsas y Empaque","KG",39.99,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["BR1526","BOLSA NATURAL ROLLO 15X26 CMS","Bolsas y Empaque","ROLLO",48.28,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["JIROJO50B","JALADOR DE 50 CM ROJO CON BASTÃƒâ€œN","Utensilios de Limpieza","PZA",29.31,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["VIC400","TRAPEADOR VICTORIA 400 GRS","Utensilios de Limpieza","PZA",41.29,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502266077275","RECOGEDOR METÃƒÂLICO HERCULES","Utensilios de Limpieza","PZA",25.88,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7501023130864","GUANTE SATINADO GRANDE ROJO","Utensilios de Limpieza","PAR",18.96,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502221456220","DESENGRASANTE FAST LINEA LEM","QuÃƒÂmicos Especializados","GALON",106.75,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["100849449","AROMATIZANTE VIEW LINEA LEM","QuÃƒÂmicos Especializados","GALON",86,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502266070115","SARROX ACIDO MURIATICO 1 LT","QuÃƒÂmicos Especializados","PZA",19.25,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["91694","SERVILLETA BARRAMESA CRIS","PapelerÃƒÂa","CAJA",305,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["POPOTE26","POPOTE 26 CM 4/500","Variados","CAJILLA",64.65,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7501023122241","Cubeta con Exprimidor SCOTCH BRITE","Variados","PZA",146,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["NNOPA00","Pastilla Azul WIESE 48g","Variados","CAJA",119.99,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["NTAAS30","Tapete Anti-Salpicadura WIESE","Variados","PZA",58.62,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["100846300","SUMA GRILL DESENGRASANTE","Limpieza Profunda","GALON",326,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7501025403232","PINOL MULTILIMPIADOR 9 LTS","Limpieza Profunda","GALON",144,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["101107394","SUMA DISH D1 DETERGENTE LÃƒÂQUIDO","Jabones Especializados","GALON",270,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["TR03610","FAPSA TR180 TOALLA EN ROLLO","Toallas y Servilletas","CAJA",335.01,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["SE24401","LEVEL PRO SERVILLETA BLANCA","Toallas y Servilletas","PQT",29.08,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["BR3545","ROLLO BOLSA 5KG 35X45","Bolsas y Empaque","ROLLO",157.55,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["BNH90120","BOLSA NEGRA HERCULES 90X120 BULTO","Bolsas y Empaque","BULTO",955.14,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502237250416","RECOGEDOR PERICO PLÃƒÂSTICO","Utensilios de Limpieza","PZA",25.39,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["ITALY","ESCOBA ITALY TIPO CEPILLO","Utensilios de Limpieza","PZA",23.62,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502266075523","KIT ATOMIZADOR VERDE 500ML","Utensilios de Limpieza","PZA",16.37,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502266070924","LOOK SARROX X3 SUPER SARRICIDA","QuÃƒÂmicos Especializados","PZA",24.51,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502221457517","SOFT CARE BASIC JABÃƒâ€œN ANTIBACTERIAL","QuÃƒÂmicos Especializados","GALON",267,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["NPAAL00","PASTILLA Alambre Wiese","Variados","PZA",11.99,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["3MP94","FIBRA P-94 CON ESPONJA 3M","Variados","CAJILLA",159.14,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502266071761","GLOW HUERTA DE LIMÃƒâ€œN 20 LTS","Limpieza General","BIDON",163.24,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502266071778","GLOW FRESCA LAVANDA 20 LTS","Limpieza General","BIDON",163.24,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502221458309","SOFT CARE DES E \"ECO\" 4X5L","Higiene y DesinfecciÃƒÂ³n","GALON",169,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7501462200159","DETERGENTE AUDAX MULTIUSOS 5 KGS","Detergentes","BULTO",99.7,"https://images.unsplash.com/photo-1626808642875-0aa545482dfb"],
  ["HB19336","DALIA HD360 HIGIÃƒâ€°NICO EN BOBINA","Papel HigiÃƒÂ©nico","CAJA",231.89,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["TI2100","DALITAS TOALLA INTERDOBLADA","Toallas y Servilletas","CAJA",200,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["C303710K","BOLSA NEGRA 76X94 CMS ROLLO","Bolsas y Empaque","ROLLO",48.8,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502266079095","PAÃƒâ€˜O MICROFIBRA AZUL 3M","Utensilios de Limpieza","PZA",18.96,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502237250010","CEPILLO PARA W.C. CON BASE","Utensilios de Limpieza","PZA",27.03,"https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"],
  ["7502266077459","CLORO 20 LTS SILTEC ULTRA","QuÃƒÂmicos Especializados","BIDON",162.93,"https://images.unsplash.com/photo-1581578731548-c64695cc6952"],
];

function salePrice(cost: number): number {
  return Number((cost * 1.30).toFixed(2));
}

async function main() {
  let created = 0;
  let updated = 0;
  let pricingCreated = 0;
  let pricingUpdated = 0;

  for (let i = 0; i < products.length; i++) {
    const [code, name, category, unit, costPrice, imageUrl] =
      products[i];

    const description =
      `${name}. Producto para limpieza, higiene o suministro empresarial.`;

    let item =
      await businessCatalogService.get({
        userId,
        organizationId,
        workspaceId,
        code: code != null ? String(code) : null,
      });

    if (!item && i === 0) {
      item =
        await businessCatalogService.get({
          userId,
          organizationId,
          workspaceId,
          id: legacyCatalogItemId,
        });
    }

    if (item) {
      item = await businessCatalogService.update({
        userId,
        organizationId,
        workspaceId,
        id: item.id,
        code: code != null ? String(code) : null,
        name: name != null ? String(name) : undefined,
        description,
        category: category != null ? String(category) : null,
        imageUrl: imageUrl != null ? String(imageUrl) : null,
        unit: unit != null ? String(unit) : null,
        available: true,
      });

      updated++;
    } else {
      item = await businessCatalogService.create({
        userId,
        organizationId,
        workspaceId,
        code: code != null ? String(code) : null,
        name: name != null ? String(name) : "",
        description: description != null ? String(description) : null,
        category: category != null ? String(category) : null,
        imageUrl: imageUrl != null ? String(imageUrl) : null,
        unit: unit != null ? String(unit) : null,
        available: true,
        features: [],
        benefits: [],
        specificRules: [
          "No inventar disponibilidad.",
          "Confirmar existencia antes de comprometer entrega.",
        ],
      });

      created++;
    }

    const estimatedSalePrice = salePrice(Number(costPrice));

    const existingPricing =
      await businessPricingService.get({
        userId,
        organizationId,
        workspaceId,
        catalogItemId: item.id,
      });

    if (existingPricing) {
      await businessPricingService.update({
        userId,
        organizationId,
        workspaceId,
        id: existingPricing.id,
        pricingType: "fixed",
        costPrice: costPrice != null ? Number(costPrice) : null,
        price: estimatedSalePrice,
        marginPercentage: 30,
        isEstimated: true,
        currency: "MXN",
        unit: unit != null ? String(unit) : null,
        active: true,
      });

      pricingUpdated++;
    } else {
      await businessPricingService.create({
        userId,
        organizationId,
        workspaceId,
        catalogItemId: item.id,
        pricingType: "fixed",
        costPrice: costPrice != null ? Number(costPrice) : null,
        price: estimatedSalePrice,
        marginPercentage: 30,
        isEstimated: true,
        currency: "MXN",
        unit: unit != null ? String(unit) : null,
        active: true,
      });

      pricingCreated++;
    }

    console.log(
      `${i + 1}/${products.length} OK | ${code} | ${name} | costo=${costPrice} | venta_estimada=${estimatedSalePrice}`,
    );
  }

  console.log("\nIMPORTACIÃƒâ€œN FINALIZADA");
  console.log(`Productos creados: ${created}`);
  console.log(`Productos actualizados: ${updated}`);
  console.log(`Precios creados: ${pricingCreated}`);
  console.log(`Precios actualizados: ${pricingUpdated}`);
  console.log(`Total productos procesados: ${products.length}`);
}

main().catch((error) => {
  console.error("\nERROR DE IMPORTACIÃƒâ€œN");
  console.error(error);
  process.exit(1);
});







