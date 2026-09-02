import {
  getLeads,
  Lead,
} from "@/platform/services/lead-service";

import {
  aiSalesManagerScheduler,
} from "./scheduler";

import {
  salesAnalyzer,
  salesPrioritizer,
  salesDecisionMaker,
  salesExecutor,
} from "@/platform/ai/sales-manager";

import {
  pipelineAnalyzer,
} from "@/platform/agents/sales/pipeline-analyzer";

import {
  salesStrategyEngine,
} from "@/platform/agents/sales/strategy";

export interface SalesManagerOptions {

  executeActions?: boolean;

  organizationId?: string;

  workspaceId?: string;

}

export interface SalesManagerResult {

  success: boolean;

  analyzed: number;

  executed: number;

  priorityLeads: Lead[];

  pipelineAnalysis:
    ReturnType<
      typeof pipelineAnalyzer.analyze
    >;

  strategy:
    ReturnType<
      typeof salesStrategyEngine.generate
    >;

  message: string;

}

export class AISalesManagerService {

  async execute(

    userId: string,

    options: SalesManagerOptions = {}

  ): Promise<SalesManagerResult> {

    const executeActions =
      options.executeActions ??
      true;

    const scheduler =
      aiSalesManagerScheduler.shouldExecute();

    if (!scheduler.shouldRun) {

      const emptyPipeline =
        pipelineAnalyzer.analyze([]);

      return {

        success: false,

        analyzed: 0,

        executed: 0,

        priorityLeads: [],

        pipelineAnalysis:
          emptyPipeline,

        strategy:
          salesStrategyEngine.generate(
            emptyPipeline
          ),

        message:
          scheduler.reason,

      };

    }

    const leads =
      await getLeads(
        userId,
        {
          organizationId:
            options.organizationId,

          workspaceId:
            options.workspaceId,
        }
      );

    /*
    ---------------------------------------
    Análisis global del pipeline
    ---------------------------------------
    */

    const pipelineAnalysis =
      pipelineAnalyzer.analyze(
        leads
      );

    /*
    ---------------------------------------
    Estrategia comercial
    ---------------------------------------
    */

    const strategy =
      salesStrategyEngine.generate(
        pipelineAnalysis
      );

    /*
    ---------------------------------------
    Análisis de leads
    ---------------------------------------
    */

    const analysis =
      salesAnalyzer.analyze(
        leads
      );

    const prioritized =
      salesPrioritizer
        .prioritize(
          analysis
        )
        .slice(0, 5);

    const decisions =
      salesDecisionMaker.decide(
        prioritized
      );

    /*
    ---------------------------------------
    EJECUCIÓN OPCIONAL
    ---------------------------------------

    El Dashboard solamente analiza.

    Las acciones comerciales únicamente
    se ejecutan cuando executeActions=true.
    */

    if (!executeActions) {

      return {

        success: true,

        analyzed:
          leads.length,

        executed: 0,

        priorityLeads:
          prioritized.map(
            item => item.lead
          ),

        pipelineAnalysis,

        strategy,

        message:
          "AI Sales Manager analizado correctamente sin ejecutar acciones.",

      };

    }

    /*
    ---------------------------------------
    EJECUCIÓN COMERCIAL
    ---------------------------------------
    */

    const execution =
      await salesExecutor.execute(

        userId,

        decisions,

        options.organizationId ?? "",

        options.workspaceId ?? ""

      );

    return {

      success:
        execution.success,

      analyzed:
        execution.analyzed,

      executed:
        execution.executed,

      priorityLeads:
        prioritized.map(
          item => item.lead
        ),

      pipelineAnalysis,

      strategy,

      message:
        "AI Sales Manager ejecutado correctamente.",

    };

  }

}

export const aiSalesManagerService =
  new AISalesManagerService();


